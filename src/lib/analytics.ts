import posthog from "posthog-js";

type AnalyticsEvents = {
  add_job_click: { location: "dashboard" | "jobs-list" };
  visit_posting_click: undefined;
  edit_job_click: undefined;
  delete_job_click: undefined;
  manual_entry_click: undefined;
};

export function trackEvent<E extends keyof AnalyticsEvents>(
  event: E,
  ...args: AnalyticsEvents[E] extends undefined ? [] : [properties: AnalyticsEvents[E]]
): void {
  posthog.capture(event, args[0]);
}
