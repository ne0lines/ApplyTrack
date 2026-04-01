/**
 * Translates stored Swedish workload/employment-type values for display.
 * The database always stores these in Swedish (matching Arbetsförmedlingen).
 * When locale is "en" we map them to English equivalents; unknown values fall
 * back to the stored string unchanged.
 */

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
