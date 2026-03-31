import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { type PaginatedResponse } from "../types";
import { api } from "../axios";

export type Notification = {
  imageId: string;
  speciesDetected: string[];
  cameraId: string;
  sublocation: string;
  notificationStatus: string;
  dateTime: string;
};
type Notifications = Notification[];
type NotificationParams = {
  location: string;
  pageIndex: number;
  pageSize: number;
};

type NotificationResp = PaginatedResponse<Notifications>;

export const useNotifications = ({
  params,
  options,
}: {
  params: NotificationParams;
  options: UseQueryOptions<NotificationResp>;
}) =>
  useQuery<NotificationResp>({
    ...options,
    queryKey: ["notifications", params],
    queryFn: async () => {
      const response = await api.get("data/notification", {
        params,
      });
      return response.data as NotificationResp;
    },
  });

type NotificationImage = {
  imageId: string;
  jpegString: string;
};
type NotificationImageParams = {
  imageId: string;
};

export const useNotificationImage = ({
  params,
  options,
}: {
  params: NotificationImageParams;
  options: UseQueryOptions<NotificationImage>;
}) =>
  useQuery<NotificationImage>({
    ...options,
    queryKey: ["notification-image", params],
    queryFn: async () => {
      const response = await api.get("data/notificationImage", {
        params,
      });
      return response.data as NotificationImage;
    },
    enabled: false,
    placeholderData: undefined,
  });
