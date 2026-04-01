"use client";

import { Job, JobStatus } from "@/app/types";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Board from "./board";
import { QuickImportInput } from "./quick-import-input";

type TodoItem = {
  dueAt: number;
  id: string;
  jobId: string;
  text: string;
};

const monthMap: Record<string, number> = {
  jan: 0,
  januari: 0,
  feb: 1,
  februari: 1,
  mar: 2,
  mars: 2,
  apr: 3,
  april: 3,
  maj: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  aug: 7,
  augusti: 7,
  sep: 8,
  sept: 8,
  september: 8,
  okt: 9,
  oktober: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseSwedishDate(value: string): Date | null {
  const trimmedValue = value.trim().toLowerCase();
  const match = /^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/.exec(trimmedValue);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const monthToken = match[2].replace(".", "");
  const year = Number(match[3]);
  const month = monthMap[monthToken];

  if (month === undefined) {
    return null;
  }

  return new Date(year, month, day);
}

function formatDueDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "sv-SE", {
    day: "numeric",
    month: "long",
  }).format(date);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function findTimelineDate(job: Job, matcher: (event: string) => boolean): Date | null {
  const match = [...job.timeline]
    .reverse()
    .find((item) => matcher(item.event.toLowerCase()));

  return match ? parseSwedishDate(match.date) : null;
}

function getSavedDate(job: Job): Date | null {
  return findTimelineDate(job, (event) => event.includes("sparat"));
}

function getAppliedDate(job: Job): Date | null {
  return findTimelineDate(job, (event) => event.includes("ansökan skickad"));
}

function getInterviewDate(job: Job): Date | null {
  const interviewDate = findTimelineDate(job, (event) => event.includes("intervju"));

  if (interviewDate) {
    return interviewDate;
  }

  return getAppliedDate(job);
}

function getTodoItems(
  jobs: Job[],
  locale: string,
  t: (key: string, values?: Record<string, string>) => string,
): TodoItem[] {
  const now = new Date();

  return jobs
    .flatMap((job): TodoItem[] => {
      if (job.status === JobStatus.SAVED) {
        const savedDate = getSavedDate(job);

        if (!savedDate) {
          return [];
        }

        const dueDate = addDays(savedDate, 3);

        return [
          {
            dueAt: dueDate.getTime(),
            id: `${job.id}-saved`,
            jobId: job.id,
            text:
              dueDate < now
                ? t("todoSavedOverdue", { company: job.company, title: job.title, date: formatDueDate(dueDate, locale) })
                : t("todoSaved", { company: job.company, title: job.title, date: formatDueDate(dueDate, locale) }),
          },
        ];
      }

      if (job.status === JobStatus.APPLIED) {
        const appliedDate = getAppliedDate(job);

        if (!appliedDate) {
          return [];
        }

        const followUpDate = addDays(appliedDate, 14);

        if (followUpDate > now) {
          return [];
        }

        return [
          {
            dueAt: followUpDate.getTime(),
            id: `${job.id}-applied`,
            jobId: job.id,
            text: t("todoApplied", { company: job.company, title: job.title }),
          },
        ];
      }

      if (job.status === JobStatus.INTERVIEW) {
        const interviewDate = getInterviewDate(job);

        if (!interviewDate) {
          return [];
        }

        const contactDate = addDays(interviewDate, 7);

        if (contactDate > now) {
          return [];
        }

        return [
          {
            dueAt: contactDate.getTime(),
            id: `${job.id}-interview`,
            jobId: job.id,
            text: t("todoInterview", { company: job.company, title: job.title }),
          },
        ];
      }

      return [];
    })
    .sort((firstItem, secondItem) => firstItem.dueAt - secondItem.dueAt);
}

export default function Pipeline({ jobs }: Readonly<{ jobs: Job[] }>) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  if (jobs.length === 0) {
    return (
      <section className="w-full">
        <article className="overflow-hidden mt-5">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-display text-3xl leading-tight md:text-[2rem]">
                {t("emptyHeadline")}
              </h2>
              <p className="mt-3 text-base text-app-muted sm:text-lg">
                {t("emptyDescription")}
              </p>
            </div>

            <div className="py-20">
              <QuickImportInput />
            </div>
          </div>
        </article>
      </section>
    );
  }

  const saved = jobs.filter((j) => j.status === JobStatus.SAVED);
  const applied = jobs.filter((j) => j.status === JobStatus.APPLIED);
  const interviewed = jobs.filter((j) => j.status === JobStatus.INTERVIEW);
  const inProcess = jobs.filter((j) => j.status === JobStatus.IN_PROCESS);
  const offers = jobs.filter((j) => j.status === JobStatus.OFFER);
  const todoItems = getTodoItems(jobs, locale, t);

  return (
    <section className="w-full">
      <article className="mt-4 rounded-2xl border border-app-stroke bg-app-card p-4">
        <h3 className="mb-2 text-xl font-display">{t("todo")}</h3>
        {todoItems.length > 0 ? (
          <div className="divide-y divide-app-stroke text-base text-app-muted">
            {todoItems.map((item) => (
              <Link
                key={item.id}
                href={`/jobb/${item.jobId}`}
                className="block py-3 transition first:pt-0 last:pb-0 hover:text-app-primary"
              >
                {item.text}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-base text-app-muted">
            {t("todoEmpty")}
          </p>
        )}
      </article>
      <h2 className="mt-6 mb-3 font-display text-3xl md:text-[1.75rem]">{t("pipeline")}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {applied.length > 0 && (
          <Board
            jobs={applied}
            label={t("boardApplied")}
            borderColor="border-blue-400"
            bgColor="bg-blue-100"
          />
        )}

        {inProcess.length > 0 && (
          <Board
            jobs={inProcess}
            label={t("boardInProcess")}
            borderColor="border-amber-400"
            bgColor="bg-amber-100"
          />
        )}

        {interviewed.length > 0 && (
          <Board
            jobs={interviewed}
            label={t("boardInterview")}
            borderColor="border-cyan-400"
            bgColor="bg-cyan-100"
          />
        )}
        {offers.length > 0 && (
          <Board
            jobs={offers}
            label={t("boardOffer")}
            borderColor="border-green-400"
            bgColor="bg-green-100"
          />
        )}
        {saved.length > 0 && <Board jobs={saved} label={t("boardSaved")} />}
      </div>
    </section>
  );
}
