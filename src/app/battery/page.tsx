"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/datatable";
import { Progress } from "~/components/ui/progress";
import { TableSkeleton } from "~/components/ui/skeletons";
import { useBatteryQuery, type Device } from "~/lib/model/battery";
import { auth$ } from "~/lib/states/auth";
import { settings$ } from "~/lib/states/settings";
import { cn } from "~/lib/utils";

const meta = {
  headerClassName: "text-center w-fit",
  cellClassName: "text-center",
  btnClassName: "justify-center",
};

const columns: ColumnDef<Device>[] = [
  {
    header: "Camera ID",
    accessorKey: "cameraId",
    meta: {
      ...meta,
      inAccordionTrigger: true,
    },
  },
  {
    header: "Location",
    accessorKey: "sublocation",
    meta,
  },
  {
    header: "Last Updated On",
    accessorKey: "dateTime",
    meta,
  },
  {
    header: "Battery",
    accessorKey: "batteryPercentage",
    cell: ({ cell }) => {
      const value = cell.getValue() as number;
      return (
        <Progress
          className={cn(
            "h-4 w-[20vw] border md:w-auto",
            value > 60
              ? "border-success"
              : value > 30
                ? "border-warning"
                : "border-destructive",
          )}
          value={value}
          max={100}
          indicator={{
            className:
              "bg-" +
              (value > 60 ? "success" : value > 30 ? "warning" : "destructive"),
          }}
        >
          <span className="absolute left-0 z-10 h-full w-full text-center align-middle text-xs font-bold text-foreground">
            {value}%
          </span>
        </Progress>
      );
    },
    meta: {
      ...meta,
      inAccordionTrigger: true,
    },
  },
  {
    header: "Network Operator",
    accessorKey: "simOperator",
    meta,
  },
];

export default function BatteryMonitor() {
  const auth = auth$.get();
  const settings = settings$.get();

  const devices = useBatteryQuery({
    params: {
      location: settings.currentLocation ?? auth?.location[0],
    },
  });

  return (
    <div className="flex flex-col gap-4 px-8 pt-4">
      <h2 className="text-4xl font-medium">Battery Monitor</h2>
      <div className="rounded-md border p-4 shadow-md">
        {devices.isLoading ? (
          <TableSkeleton columns={columns.length} rows={5} />
        ) : (
          <DataTable
            columns={columns}
            data={(devices.data ?? []).map((device) => ({
              ...device,
              batteryPercentage:
                device.batteryPercentage === 101 ? 0 : device.batteryPercentage,
            }))}
            sortable
            enablePageSizeChange
          />
        )}
      </div>
    </div>
  );
}
