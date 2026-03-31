"use client";

import { type UseQueryResult } from "@tanstack/react-query";
import { type UseThemeProps } from "next-themes/dist/types";

import { useTheme } from "next-themes";
import {
  XAxis,
  YAxis,
  BarChart,
  CartesianGrid,
  Bar,
  PieChart,
  Pie,
  Label,
  LineChart,
  Line,
} from "recharts";
import { DataTable } from "~/components/ui/datatable";
import {
  type BatteryInfo,
  type DetectionsPerMonth,
  type DetectionTime,
  type PercentageChart,
  type SanitizedDetectionTime,
  useBatteryHistory,
  useDetectionsPerMonth,
  useDetectionTime,
  useHotspotSubLocation,
  usePercentageChart,
} from "~/lib/model/analytics";
import { useSpeciesNames, useSubLocationNames } from "~/lib/model/camera";
import { analyticsOptions$ } from "~/lib/states/analytics";
import { auth$ } from "~/lib/states/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { settings$ } from "~/lib/states/settings";
import { Months } from "~/lib/constants";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { cn, setParamsinDate } from "~/lib/utils";
import { MultiSelect } from "~/components/ui/multi-select";
import { useBatteryQuery } from "~/lib/model/battery";

export default function Dashboard() {
  const theme = useTheme();
  const auth = auth$.get();
  const settings = settings$.get();
  const options = analyticsOptions$.get();

  const species = useSpeciesNames({
    params: { location: settings?.currentLocation ?? auth?.location[0] },
  });

  const subLocationNames = useSubLocationNames({
    params: { location: settings.currentLocation ?? auth?.location[0] },
  });

  const hotspotSubLocation = useHotspotSubLocation({
    params: {
      location: settings?.currentLocation ?? auth?.location[0],
      filter: options.hotpotSubLocation.filter,
      species:
        options.hotpotSubLocation.species !== "All"
          ? options.hotpotSubLocation.species
          : undefined,
    },
  });

  const detectionsPerMonth = useDetectionsPerMonth({
    params: {
      location: settings?.currentLocation ?? auth?.location[0],
      species:
        options.detectionsPerMonth.species !== "All"
          ? options.detectionsPerMonth.species
          : species.data?.map((species) => species.species).join(","),
      sublocation:
        options.detectionsPerMonth.subLocation !== "All"
          ? options.detectionsPerMonth.subLocation
          : undefined,
    },
    options: {
      queryKey: [
        "detectionsPerMonth",
        options.detectionsPerMonth.species,
        options.detectionsPerMonth.subLocation,
        species.data,
      ],
    },
  });

  const detectionTime = useDetectionTime({
    params: {
      location: settings?.currentLocation ?? auth?.location[0],
      species:
        options.detectionTime.species !== "All"
          ? options.detectionTime.species
          : undefined,
      sublocation:
        options.detectionTime.subLocation !== "All"
          ? options.detectionTime.subLocation
          : undefined,
    },
  });

  const percentageChart = usePercentageChart({
    params: {
      location: settings?.currentLocation ?? auth?.location[0],
      species:
        options.percentageChart.species !== "All"
          ? options.percentageChart.species
          : species.data?.map((species) => species.species).join(",") ?? "",
    },
  });

  const devices = useBatteryQuery({
    params: {
      location: settings?.currentLocation ?? auth?.location[0],
    },
  });

  const batteryHistory = useBatteryHistory({
    params: {
      location: settings?.currentLocation ?? auth?.location[0],
      cameraId:
        options.batteryUsage.cameraId ?? devices.data?.[0]?.cameraId ?? "",
    },
  });

  return (
    <main className="flex flex-col gap-4 px-8 pt-4">
      <h2 className="text-4xl font-medium">Analytics</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex w-full flex-col gap-4 rounded-md border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Number of detections</h3>
            <Select
              value={options.detectionsPerMonth.subLocation}
              onValueChange={(selected) => {
                analyticsOptions$.set({
                  ...options,
                  detectionsPerMonth: {
                    ...options.detectionsPerMonth,
                    subLocation: selected,
                  },
                });
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="All" value="All">
                  All
                </SelectItem>
                {subLocationNames.data?.map((subLocation) => (
                  <SelectItem
                    key={subLocation.sublocation}
                    value={subLocation.sublocation}
                  >
                    {subLocation.sublocation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-full w-full">
            <DetectionsPerMonthBarChart
              detectionsPerMonth={detectionsPerMonth}
              theme={theme}
              species={
                options.detectionsPerMonth.species === "All"
                  ? species.data?.map((species) => species.species) ?? []
                  : [options.detectionsPerMonth.species]
              }
              chartColors={options.colors}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-md border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Detection Time</h3>
            <div className="flex items-center gap-2">
              <Select
                value={options.detectionTime.species}
                onValueChange={(selected) => {
                  analyticsOptions$.set({
                    ...options,
                    detectionTime: {
                      ...options.detectionTime,
                      species: selected,
                    },
                  });
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select Species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="All" value="All">
                    All
                  </SelectItem>
                  {species.data?.map((species) => (
                    <SelectItem
                      key={species.species}
                      value={species.species}
                      className="capitalize"
                    >
                      {species.species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={options.detectionTime.subLocation}
                onValueChange={(selected) => {
                  analyticsOptions$.set({
                    ...options,
                    detectionTime: {
                      ...options.detectionTime,
                      subLocation: selected,
                    },
                  });
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select Species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="All" value="All">
                    All
                  </SelectItem>
                  {subLocationNames.data?.map((subLocation) => (
                    <SelectItem
                      key={subLocation.sublocation}
                      value={subLocation.sublocation}
                    >
                      {subLocation.sublocation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-full w-full">
            <DetectionTimeBarChart
              detectionTime={detectionTime}
              theme={theme}
              color={
                options.detectionTime.species === "All"
                  ? "hsl(var(--chart-1))"
                  : options.colors[options.detectionTime.species] ??
                    "hsl(var(--chart-1))"
              }
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-md border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Detection Percentage</h3>
            <div className="flex items-center gap-2">
              <MultiSelect
                options={species.data?.map((species) => species.species) ?? []}
                selected={options.percentageChart.species.split(",")}
                onChange={(selected) => {
                  selected = selected.filter((item) => item.length > 0);
                  analyticsOptions$.set({
                    ...options,
                    percentageChart: {
                      ...options.percentageChart,
                      species: selected.join(","),
                    },
                  });
                }}
              />
            </div>
          </div>
          <div className="h-full w-full">
            <PercentageChart
              percentageChart={percentageChart}
              theme={theme}
              colors={options.colors}
            />
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-4 rounded-md border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Hotspot Sub Locations</h3>
            <div className="flex items-center gap-2">
              <Select
                value={options.hotpotSubLocation.species}
                onValueChange={(selected) => {
                  analyticsOptions$.set({
                    ...options,
                    hotpotSubLocation: {
                      ...options.hotpotSubLocation,
                      species: selected,
                    },
                  });
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select Species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="All" value="All">
                    All
                  </SelectItem>
                  {species.data?.map((species) => (
                    <SelectItem
                      key={species.species}
                      value={species.species}
                      className="capitalize"
                    >
                      {species.species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={options.hotpotSubLocation.filter}
                onValueChange={(selected) => {
                  if (selected !== "month" && selected !== "year") return;
                  analyticsOptions$.set({
                    ...options,
                    hotpotSubLocation: {
                      ...options.hotpotSubLocation,
                      filter: selected,
                    },
                  });
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="month" value="month">
                    Monthly
                  </SelectItem>
                  <SelectItem key="year" value="year">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DataTable
            columns={[
              {
                header: "Sub Location",
                accessorKey: "sublocation",
                meta: {
                  inAccordionTrigger: true,
                },
              },
              {
                header: "Number of Cameras",
                accessorKey: "numberOfCameras",
              },
              {
                header: "Number of Records",
                accessorKey: "numberOfRecords",
              },
            ]}
            data={hotspotSubLocation.data ?? []}
            defaultPageSize={5}
          />
        </div>
        <div className="flex w-full flex-col gap-4 rounded-md border p-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Battery Usage</h3>
            <div className="flex items-center gap-2">
              <Select
                value={
                  options.batteryUsage.cameraId ?? devices.data?.[0]?.cameraId
                }
                onValueChange={(selected) => {
                  analyticsOptions$.set({
                    ...options,
                    batteryUsage: {
                      ...options.batteryUsage,
                      cameraId: selected,
                    },
                  });
                }}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Camera ID" />
                </SelectTrigger>
                <SelectContent>
                  {devices.data?.map((device) => (
                    <SelectItem key={device.cameraId} value={device.cameraId}>
                      {device.cameraId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-full w-full">
            <BatteryChart batteryHistory={batteryHistory} theme={theme} />
          </div>
        </div>
      </div>
    </main>
  );
}

function PercentageChart({
  percentageChart,
  theme,
  colors,
}: {
  percentageChart: UseQueryResult<PercentageChart[], Error>;
  theme: UseThemeProps;
  colors: Record<string, string>;
}) {
  const chartConfig = {
    numberOfDetection: {
      label: "Number of Detections",
    },
    ...colorsToChartConfig(colors),
  } satisfies ChartConfig;

  const total =
    percentageChart.data?.reduce(
      (acc, item) => acc + item.numberOfDetection,
      0,
    ) ?? 0;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={(value) =>
                ((Number(value) / total) * 100).toLocaleString() + "%"
              }
              className={cn(
                "p-2 capitalize shadow-sm",
                theme.theme === "dark" ? "bg-black" : "bg-white",
              )}
            />
          }
        />
        <Pie
          data={(percentageChart.data ?? []).map((item) => ({
            ...item,
            fill: colors[item.species],
          }))}
          dataKey="numberOfDetection"
          nameKey="species"
          innerRadius={90}
          strokeWidth={8}
        />
        <ChartLegend content={<ChartLegendContent className="capitalize" />} />
        <Label
          content={({ viewBox }) => {
            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {total.toLocaleString()}
                    {"%"}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 24}
                    className="fill-muted-foreground"
                  >
                    Detections
                  </tspan>
                </text>
              );
            }
          }}
        />
      </PieChart>
    </ChartContainer>
  );
}

function DetectionTimeBarChart({
  detectionTime,
  theme,
  color,
}: {
  detectionTime: UseQueryResult<DetectionTime[], Error>;
  theme: UseThemeProps;
  color: string;
}) {
  const chartConfig = {
    numberOfDetection: {
      label: "Number of Detections",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        accessibilityLayer
        data={sanitizeDetectionTimeData(detectionTime.data ?? [])}
        margin={{
          top: 30,
          right: 50,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="interval"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          dataKey="numberOfDetection"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className={cn(
                "p-2 shadow-sm",
                theme.theme === "dark" ? "bg-black" : "bg-white",
              )}
            />
          }
        />
        <Bar
          type="monotone"
          strokeWidth={2}
          dataKey="numberOfDetection"
          fill={color}
          radius={[4, 4, 0, 0]}
        />
        <ChartLegend content={<ChartLegendContent className="capitalize" />} />
      </BarChart>
    </ChartContainer>
  );
}

function DetectionsPerMonthBarChart({
  detectionsPerMonth,
  theme,
  species,
  chartColors,
}: {
  detectionsPerMonth: UseQueryResult<DetectionsPerMonth[], Error>;
  theme: UseThemeProps;
  species: string[];
  chartColors: Record<string, string>;
}) {
  const config = {
    numberOfDetection: {
      label: "Number of Detections",
    },
    ...colorsToChartConfig(chartColors),
  } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="h-full w-full">
      <BarChart
        accessibilityLayer
        data={getChartDetectionsData(detectionsPerMonth.data ?? [], species)}
        margin={{
          top: 30,
          right: 50,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timeString"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className={cn(
                "p-2 capitalize shadow-sm",
                theme.theme === "dark" ? "bg-black" : "bg-white",
              )}
            />
          }
        />
        {species.map((specie) => (
          <Bar
            key={specie}
            type="monotone"
            strokeWidth={2}
            dataKey={`${specie}`}
            fill={`var(--color-${specie})`}
            radius={[4, 4, 0, 0]}
          />
        ))}
        <ChartLegend content={<ChartLegendContent className="capitalize" />} />
      </BarChart>
    </ChartContainer>
  );
}

function BatteryChart({
  batteryHistory,
  theme,
}: {
  batteryHistory: UseQueryResult<BatteryInfo[], Error>;
  theme: UseThemeProps;
}) {
  const config = {
    batteryPercentage: {
      label: "Battery Percentage",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={batteryHistory.data ?? []}
        margin={{
          top: 30,
          right: 50,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="dateTime"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => {
            const date = new Date(value as string);
            return `${date.getDate()} ${Months[date.getMonth()]}`;
          }}
        />
        <YAxis
          dataKey="batteryPercentage"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className={cn(
                "p-2 capitalize shadow-sm",
                theme.theme === "dark" ? "bg-black" : "bg-white",
              )}
              labelFormatter={(value) =>
                new Date(value as string).toLocaleString()
              }
            />
          }
        />
        <Line
          dataKey="batteryPercentage"
          type="monotone"
          strokeWidth={2}
          stroke="#00E785"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function getChartDetectionsData(
  data: DetectionsPerMonth[],
  species: string[],
): {
  time: string;
  timeString: string;
  [key: string]: string | number;
}[] {
  // Find the most recent date in the data
  const sortedDates = data.map(item => new Date(item.year, item.month - 1))
                          .sort((a, b) => b.getTime() - a.getTime());
  const mostRecentDate = sortedDates[0] ?? new Date();
  
  // Initialize the result array
  const result: {
    time: string;
    timeString: string;
    [key: string]: string | number;
  }[] = [];

  // Create a map for species counts
  const speciesMap: Record<string, number> = {};
  species.forEach(specie => {
    speciesMap[specie] = 0;
  });

  // Generate entries for the last 6 months
  for (let i = 0; i < 6; i++) {
    const date = new Date(mostRecentDate);
    date.setMonth(mostRecentDate.getMonth() - i);
    
    const month = date.getMonth() + 1; // Adding 1 since getMonth() returns 0-11
    const year = date.getFullYear();
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    result.push({
      time: `${month}-${year}`,
      timeString: `${monthNames[month - 1]} ${year.toString().slice(2)}`,
      ...speciesMap
    });
  }

  // Fill in the actual data
  data.forEach(detection => {
    const index = result.findIndex(item => 
      item.time === `${detection.month}-${detection.year}`
    );
    
    if (index !== -1 && detection.detectedSpeciesServer) {
      // Type assertion to handle dynamic property access
      (result[index] as Record<string, string | number>)[detection.detectedSpeciesServer] = detection.recordsCount;
    }
  });

  // Reverse to get chronological order (oldest to newest)
  result.reverse();

  return result;
}

function colorsToChartConfig(colors: Record<string, string>) {
  const chartConfig: ChartConfig = {};
  Object.entries(colors).forEach(([key, value]) => {
    chartConfig[key] = {
      label: key,
      color: value,
    };
  });
  return chartConfig;
}

function sanitizeDetectionTimeData(
  data: DetectionTime[],
): SanitizedDetectionTime[] {
  const detectionTimeIntervals = [
    "00:00 - 03:59",
    "04:00 - 07:59",
    "08:00 - 11:59",
    "12:00 - 15:59",
    "16:00 - 19:59",
    "20:00 - 23:59",
  ];
  return data.map((item) => ({
    ...item,
    interval: detectionTimeIntervals[item.interval] ?? "Unknown",
  }));
}
