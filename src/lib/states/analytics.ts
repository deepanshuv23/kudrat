import { observable } from "@legendapp/state";

export const analyticsOptions$ = observable<{
  colors: Record<string, string>;
  detectionsPerMonth: {
    species: string;
    subLocation: string;
  };
  hotpotSubLocation: {
    species: string;
    filter: "month" | "year";
  };
  detectionTime: {
    species: string;
    subLocation: string;
  };
  percentageChart: {
    species: string;
  };
  batteryUsage: {
    cameraId?: string;
  };
}>({
  colors: {
    human: "#00AAFE",
    animal: "#F1003E",
    vehicle: "#E6D101",
    elephant: "#00E785",
  },
  detectionsPerMonth: {
    species: "All",
    subLocation: "All",
  },
  hotpotSubLocation: {
    species: "All",
    filter: "month",
  },
  detectionTime: {
    species: "All",
    subLocation: "All",
  },
  percentageChart: {
    species: "All",
  },
  batteryUsage: {},
});
