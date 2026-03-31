"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "never",        // fully anonymous — no user profiles created
      capture_pageview: false,          // handled manually via PostHogPageView (App Router)
      disable_session_recording: true,  // Sentry handles session replays
      autocapture: false,               // manual events only — keeps monthly quota predictable
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
