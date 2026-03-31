import {
  Battery,
  Bell,
  Camera,
  LineChart,
  MessagesSquare,
  Settings,
} from "lucide-react";

export const routesNames: Record<string, string> = {
  "": "Dashboard",
  battery: "Battery Monitor",
  settings: "Settings",
  data: "Data",
  camera: "Camera Feed",
  notifications: "Notifications",
  analytics: "Analytics",
  chat: "AI Chat",
};

export const navRoutes = [
  {
    title: "Camera Feed",
    route: "/data/camera",
    icon: Camera,
  },
  {
    title: "Battery Monitor",
    route: "/battery",
    icon: Battery,
  },
  {
    title: "Analytics",
    route: "/analytics",
    icon: LineChart,
  },
  {
    title: "Notifications",
    route: "/notifications",
    icon: Bell,
  },
  {
    title: "AI Chat",
    badge: "Beta",
    route: "/chat",
    icon: MessagesSquare,
  },
  {
    title: "Settings",
    route: "/settings",
    icon: Settings,
    end: true,
  },
];

export const chartColors = [
  "#F1003E",
  "#00AAFE",
  "#E6D101",
  "#00E785",
  "#9500F2",
  "#FF9903",
  "#E200AA",
  "#A3CCFE",
  "#00B496",
];

export const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
