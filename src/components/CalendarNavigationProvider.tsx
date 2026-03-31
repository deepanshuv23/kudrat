"use client";

import { type ReactNode } from "react";
import { NavigationProvider } from "react-day-picker";

export default function CalendarNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
