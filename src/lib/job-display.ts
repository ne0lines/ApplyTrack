/**
 * Translates stored Swedish workload/employment-type values for display.
 * The database always stores these in Swedish (matching Arbetsförmedlingen).
 * When locale is "en" we map them to English equivalents; unknown values fall
 * back to the stored string unchanged.
 */

const swedishMonthMap: Record<string, number> = {
  jan: 0, januari: 0, feb: 1, februari: 1, mar: 2, mars: 2,
  apr: 3, april: 3, maj: 4, jun: 5, juni: 5, jul: 6, juli: 6,
  aug: 7, augusti: 7, sep: 8, sept: 8, september: 8,
  okt: 9, oktober: 9, nov: 10, november: 10, dec: 11, december: 11,
};

function parseSwedishDate(value: string): Date | null {
  const match = /^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/.exec(value.trim().toLowerCase());
  if (!match) return null;
  const month = swedishMonthMap[match[2].replace(".", "")];
  if (month === undefined) return null;
  return new Date(Number(match[3]), month, Number(match[1]));
}

export function formatStoredDate(value: string, locale: string): string {
  const parsed = parseSwedishDate(value);
  if (!parsed) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

const timelineEventEnMap: Record<string, string> = {
  "jobbet sparat": "Job saved",
  "jobbet skapat": "Job created",
  "ansökan skickad": "Application sent",
  "sista ansökningsdag": "Application deadline",
};

export function displayTimelineEvent(event: string, locale: string): string {
  if (locale !== "en") return event;
  return timelineEventEnMap[event.toLowerCase()] ?? event;
}

const workloadEnMap: Record<string, string> = {
  Heltid: "Full-time",
  Deltid: "Part-time",
};

const employmentTypeEnMap: Record<string, string> = {
  Tillsvidare: "Permanent",
  Visstid: "Temporary",
  Provanställning: "Probationary",
  Konsult: "Consultant",
};

export function displayWorkload(value: string, locale: string): string {
  if (locale !== "en") return value;
  return workloadEnMap[value] ?? value;
}

export function displayEmploymentType(value: string, locale: string): string {
  if (locale !== "en") return value;
  return employmentTypeEnMap[value] ?? value;
}
