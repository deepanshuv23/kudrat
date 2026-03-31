"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ImagePreview from "~/components/ImagePreview";
import { DataTable } from "~/components/ui/datatable";
import { TableSkeleton } from "~/components/ui/skeletons";
import {
  type Notification,
  useNotifications,
  useNotificationImage,
} from "~/lib/model/notifications";
import { auth$ } from "~/lib/states/auth";
import { settings$ } from "~/lib/states/settings";

const columns: ColumnDef<Notification>[] = [
  {
    header: "Notification",
    accessorKey: "cameraId",
    cell: ({ cell }) => {
      const value = cell.row.original;
      return (
        <div className="cursor-pointer">
          <h5 className="font-bold">
            {value.speciesDetected.join(", ")} detected at {value.sublocation}
          </h5>
          <p className="text-sm text-gray-500">Camera ID: {value.cameraId}</p>
        </div>
      );
    },
    meta: {
      className: "w-10/12",
      inAccordionTrigger: true,
    },
  },
  {
    header: "Time",
    accessorKey: "dateTime",
    cell: ({ cell }) => {
      const value = cell.getValue() as string;
      return (
        <div className="cursor-pointer">
          <p className="text-sm text-gray-500">
            {getTimeDifference(new Date(value))}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(value).toLocaleString()}
          </p>
        </div>
      );
    },
    meta: {
      className: "w-2/12",
    },
  },
];

export default function NotificationsPage() {
  const auth = auth$.get();
  const settings = settings$.get();

  const [imageId, setImageId] = useState<string>();

  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageIndex: 0,
    pageSize: 10,
  });

  const notifications = useNotifications({
    params: {
      location: settings.currentLocation ?? auth?.location[0],
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
    },
    options: {
      queryKey: ["notifications", pagination],
    },
  });

  const image = useNotificationImage({
    params: {
      imageId: imageId ?? "",
    },
    options: {
      queryKey: ["notification-image", imageId],
    },
  });

  useEffect(() => {
    void image.refetch();
  }, [image, imageId]);

  return (
    <div className="flex flex-col gap-4 px-8 pt-4">
      <h2 className="text-3xl font-bold">Notifications</h2>
      <div className="rounded-md border p-4 shadow-md">
        {notifications.isLoading ? (
          <TableSkeleton columns={columns.length} rows={pagination.pageSize} />
        ) : (
          <DataTable
            columns={columns}
            data={notifications.data?.content ?? []}
            useManualPagination
            manualPagination={{
              totalRows: notifications.data?.totalElements ?? 0,
            }}
            onPaginationChange={setPagination}
            state={{
              pagination,
            }}
            onRowClick={(row) => {
              setImageId(row.imageId);
            }}
          />
        )}
        <ImagePreview
          open={!!imageId}
          jpegString={image.data?.jpegString ?? ""}
          description="Notification Image"
          imageAlt="Notification Image"
          onOpenChange={(open) => {
            if (!open) setImageId(undefined);
          }}
        />
      </div>
    </div>
  );
}

function getTimeDifference(time: Date) {
  const diff = (Date.now() - time.getTime()) / 1000;
  if (diff > 86400)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
  if (diff > 3600) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff > 60) return `${Math.floor(diff / 60)} minutes ago`;
  return `${diff} seconds ago`;
}
