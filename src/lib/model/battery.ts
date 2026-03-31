import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export type Device = {
  id: string;
  sublocation: string;
  cameraId: string;
  dateTime: string;
  batteryPercentage: number;
  simOperator: string;
};
type DeviceParams = {
  location: string;
};

export const useBatteryQuery = ({ params }: { params: DeviceParams }) =>
  useQuery<Device[]>({
    queryKey: ["battery"],
    queryFn: async () => {
      const response = await api.get("v1/analytics/batteryLevels", {
        params,
      });
      return (response.data as Device[]).map((device) => ({
        ...device,
        dateTime: new Date(device.dateTime).toLocaleString(),
      }));
    },
  });
