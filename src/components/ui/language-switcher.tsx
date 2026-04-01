"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();

  function switchLocale(nextLocale: string) {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-app-stroke bg-app-surface p-1">
      <button
        type="button"
        onClick={() => switchLocale("sv")}
        className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
          locale === "sv"
            ? "bg-white text-app-ink shadow-sm dark:bg-white/10 dark:text-white"
            : "text-app-muted hover:text-app-ink dark:hover:text-white"
        }`}
      >
        {t("sv")}
      </button>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
          locale === "en"
            ? "bg-white text-app-ink shadow-sm dark:bg-white/10 dark:text-white"
            : "text-app-muted hover:text-app-ink dark:hover:text-white"
        }`}
      >
        {t("en")}
      </button>
    </div>
  );
}
