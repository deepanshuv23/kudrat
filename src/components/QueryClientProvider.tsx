"use client";

import {
  QueryClient,
  QueryClientProvider as QCP,
  keepPreviousData,
} from "@tanstack/react-query";
import { type ReactNode } from "react";

export default function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
      },
    },
  });

  return <QCP client={queryClient}>{children}</QCP>;
}
