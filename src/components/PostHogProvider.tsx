"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init("phc_LGwgIpLy0p9NzAawmbKzRaU5izPAaLHS18j3YS8mFGA", {
    api_host: "https://eu.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider client={posthog}>{children}</Provider>;
}
