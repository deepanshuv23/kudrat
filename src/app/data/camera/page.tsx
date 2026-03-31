/* eslint-disable @next/next/no-img-element */
"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import ImagePreview from "~/components/ImagePreview";
import { Button } from "~/components/ui/button";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { DateTimePicker } from "~/components/ui/datepicker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { PaginationSkeleton } from "~/components/ui/skeletons";
import {
  useCameraImages,
  useSpeciesNames,
  useSubLocationNames,
} from "~/lib/model/camera";
import { auth$ } from "~/lib/states/auth";
import { cameraOptions$ } from "~/lib/states/camera";
import { settings$ } from "~/lib/states/settings";
import { dateToISOString, omitFromObject } from "~/lib/utils";

export default function CameraFeed() {
  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>();
  const Options = z
    .object({
      location: z.string(),
      subLocation: z.string(),
      species: z.string(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .refine((data) => (data.endDate ? data.startDate : true), {
      message: "Start date is required with end date",
      path: ["startDate", "endDate"],
    })
    .refine(
      (data) =>
        data.startDate && data.endDate ? data.startDate < data.endDate : true,
      {
        message: "End date must be greater than start date",
        path: ["startDate", "endDate"],
      },
    );

  const [error, setError] = useState<
    z.ZodError<{
      location: string;
      subLocation: string;
      species: string;
      startDate: Date;
      endDate: Date;
    }>
  >();

  const auth = auth$.get();
  const options = cameraOptions$.get();
  const settings = settings$.get();

  useEffect(() => {
    if (
      typeof options.startDate === "string" ||
      typeof options.endDate === "string"
    )
      cameraOptions$.set({
        ...options,
        startDate:
          typeof options.startDate === "string"
            ? new Date(options.startDate)
            : options.startDate,
        endDate:
          typeof options.endDate === "string"
            ? new Date(options.endDate)
            : options.endDate,
      });
  }, [options]);

  const subLocationNames = useSubLocationNames({
    params: { location: settings.currentLocation ?? auth?.location[0] },
  });

  const speciesNames = useSpeciesNames({
    params: { location: settings.currentLocation ?? auth?.location[0] },
  });

  const cameraImages = useCameraImages({
    params: {
      location: settings.currentLocation ?? auth?.location[0],
      sublocation: options.subLocation.trim(),
      species: options.species.trim(),
      startDate: options.startDate && dateToISOString(options.startDate),
      endDate: options.endDate && dateToISOString(options.endDate),
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
    },
    options: {
      queryKey: ["cameraImages", options],
      enabled: false,
    },
  });

  useEffect(() => {
    async function fetchCameraImages() {
      if (pagination) await cameraImages.refetch();
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchCameraImages();
  }, [pagination, options]);

  return (
    <div className="flex flex-col gap-4 px-8 py-4">
      <h2 className="text-3xl font-bold">Camera Feed</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[3fr_2fr_min-content]">
        <div className="flex flex-col justify-around gap-4 rounded-lg border px-4 py-6 md:row-span-2 xl:row-span-1 xl:flex-row">
          <div className="flex w-full flex-col gap-2">
            <Label className="flex items-center gap-2">
              Tiger Reserve Location
            </Label>
            <Input value={settings.currentLocation} disabled />
          </div>
          <Separator className="hidden xl:block" orientation="vertical" />
          <div className="flex w-full flex-col gap-2">
            <Label className="flex items-center gap-2">Sub-Location Name</Label>
            <Select
              value={options.subLocation}
              onValueChange={(value) =>
                cameraOptions$.set({ ...options, subLocation: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sub-Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Select Sub-Location</SelectItem>
                {subLocationNames.data?.map((name) => (
                  <SelectItem key={name.sublocation} value={name.sublocation}>
                    {name.sublocation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator className="hidden xl:block" orientation="vertical" />
          <div className="flex w-full flex-col gap-2">
            <Label className="flex items-center gap-2">Species</Label>
            <Select
              value={options.species}
              onValueChange={(value) =>
                cameraOptions$.set({ ...options, species: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Select Species</SelectItem>
                {speciesNames.data?.map((name) => (
                  <SelectItem key={name.species} value={name.species}>
                    {name.species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col justify-around gap-4 rounded-lg border px-4 py-6 xl:flex-row">
          <div className="flex w-full flex-col gap-2">
            <Label className="flex items-center gap-2">Start Date</Label>
            <DateTimePicker
              showIcon
              mode="single"
              time
              dateType="start"
              value={options.startDate}
              onChange={(date) =>
                cameraOptions$.set({
                  ...options,
                  startDate: date,
                })
              }
              error={
                error?.errors.filter((e) => e.path.includes("startDate"))[0]
                  ?.message
              }
            />
          </div>
          <Separator className="hidden xl:block" orientation="vertical" />
          <div className="flex w-full flex-col gap-2">
            <Label className="flex items-center gap-2">End Date</Label>
            <DateTimePicker
              showIcon
              mode="single"
              time
              dateType="end"
              value={options.endDate}
              onChange={(date) =>
                cameraOptions$.set({
                  ...options,
                  endDate: date,
                })
              }
              error={
                error?.errors.filter((e) => e.path.includes("endDate"))[0]
                  ?.message
              }
            />
          </div>
        </div>
        <Button
          className="mx-auto my-auto"
          variant="default"
          size="lg"
          onClick={async () => {
            const result = Options.safeParse(options);
            if (result.success) {
              setError(undefined);
              setPagination({ pageIndex: 0, pageSize: 10 });
              // await cameraImages.refetch();
            } else {
              setError(result.error);
              result.error.errors.forEach((error) => {
                toast.error(error.message);
              });
            }
          }}
        >
          Show Results
        </Button>
      </div>
      {cameraImages.isLoading && <CameraDataSkeleton />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cameraImages.data?.content.map((image, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <div className="group relative">
              <ImagePreview
                trigger={
                  <Button
                    variant="ghost"
                    className="absolute left-0 top-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-90"
                  >
                    <Eye className="size-5" />
                  </Button>
                }
                jpegString={image.jpegString}
                description={new Date(image.dateTime).toLocaleString()}
                imageAlt={index.toString()}
                dateTime={new Date(image.dateTime)}
                extraDetails={
                  omitFromObject(image, ["jpegString", "dateTime"]) as Record<
                    string,
                    string
                  >
                }
              />
              <img
                src={`data:image/jpeg;base64,${image.jpegString}`}
                width={600}
                height={400}
                alt={index.toString()}
              />
            </div>
            <p className="text-sm">
              DateTime: {new Date(image.dateTime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {cameraImages.isLoading && <PaginationSkeleton />}
      {cameraImages.data?.totalElements &&
      pagination &&
      !cameraImages.isLoading ? (
        <CustomPagination
          totalRows={cameraImages.data?.totalElements}
          loading={
            cameraImages.data.pageable.pageNumber !== pagination.pageIndex &&
            cameraImages.isRefetching
          }
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          onPaginationChange={async (pageIndex, pageSize) => {
            setPagination({ pageIndex, pageSize });
          }}
          enablePageSizeChange
        />
      ) : (
        <div className="text-center">No Results found</div>
      )}
    </div>
  );
}

function CameraDataSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton className="h-48 w-full" key={index} />
      ))}
    </div>
  );
}
