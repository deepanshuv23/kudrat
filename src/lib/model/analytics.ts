import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export type DetectionsPerMonth = {
  detectedSpeciesServer: string;
  recordsCount: number;
  year: number;
  month: number;
};
type DetectionsPerMonthParams = {
  location: string;
  species?: string;
  sublocation?: string;
};

export const useDetectionsPerMonth = ({
  params,
  options,
}: {
  params: DetectionsPerMonthParams;
  options?: UseQueryOptions<DetectionsPerMonth[]>;
}) =>
  useQuery<DetectionsPerMonth[]>({
    ...options,
    queryKey: ["detectionsPerMonth", params],
    queryFn: async () => {
      if (!params.species) return [];
      const response = await api.get("v1/analytics/detectionsPerMonth", {
        params,
      });
      return (response.data as DetectionsPerMonth[]).map((item) => ({
        ...item,
        detectedSpeciesServer: item.detectedSpeciesServer.replaceAll(" ", "_"),
      }));
    },
  });

type HotspotSubLocation = {
  sublocation: string;
  numberOfCameras: number;
  numberOfRecords: number;
};
type HotspotSubLocationParams = {
  location: string;
  filter: "month" | "year";
  species?: string;
};

export const useHotspotSubLocation = ({
  params,
}: {
  params: HotspotSubLocationParams;
}) =>
  useQuery<HotspotSubLocation[]>({
    queryKey: ["hotspotSubLocation", params],
    queryFn: async () => {
      const response = await api.get("v1/analytics/hotspotSubLocation", {
        params,
      });
      return response.data as HotspotSubLocation[];
    },
  });

export type DetectionTime = {
  interval: number;
  sublocation: string;
  numberOfDetection: number;
  species: string;
};
export type SanitizedDetectionTime = {
  interval: string;
  sublocation: string;
  numberOfDetection: number;
  species: string;
};
type DetectionTimeParams = {
  location: string;
  sublocation?: string;
  species?: string;
};

export const useDetectionTime = ({ params }: { params: DetectionTimeParams }) =>
  useQuery<DetectionTime[]>({
    queryKey: ["detectionTime", params],
    queryFn: async () => {
      const response = await api.get("v1/analytics/detectionTime", {
        params,
      });
      return response.data as DetectionTime[];
    },
  });

export type PercentageChart = {
  numberOfDetection: number;
  species: string;
};
type PercentageChartParams = {
  location: string;
  species: string;
};

export const usePercentageChart = ({
  params,
}: {
  params: PercentageChartParams;
}) =>
  useQuery<PercentageChart[]>({
    queryKey: ["percentageChart", params],
    queryFn: async () => {
      if (!params.species) return [];
      const response = await api.get("v1/analytics/percentageChart", {
        params,
      });
      return response.data as PercentageChart[];
    },
  });

export type BatteryInfo = {
  batteryVoltage: number;
  batteryPercentage: number;
  dateTime: string;
};
type BatteryHistory = BatteryInfo[];
type BatteryHistoryParams = {
  location: string;
  cameraId: string;
};

export const useBatteryHistory = ({
  params,
}: {
  params: BatteryHistoryParams;
}) =>
  useQuery<BatteryHistory>({
    queryKey: ["batteryHistory", params],
    queryFn: async () => {
      if (!params.cameraId) return [];
      const response = await api.get("v1/analytics/batteryChart", {
        params,
      });
      return (response.data as BatteryHistory).map((item) => ({
        ...item,
        batteryPercentage:
          item.batteryPercentage > 100 ? 0 : item.batteryPercentage,
      }));
    },
  });
