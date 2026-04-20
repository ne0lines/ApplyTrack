"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Btn } from "@/components/ui/btn";
import { trackButtonEvent, type TrackableEvent } from "@/lib/analytics";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
  track?: TrackableEvent;
  fullWidth?: boolean;
};

export function BackButton({
  fallbackHref = "/dashboard",
  label,
  className,
  track,
  fullWidth,
}: Readonly<BackButtonProps>) {
  const router = useRouter();
  const t = useTranslations("common");

  function handleClick() {
    if (track) trackButtonEvent(track);

    const sameOriginReferrer =
      typeof window !== "undefined" &&
      document.referrer !== "" &&
      new URL(document.referrer, window.location.href).origin === window.location.origin;

    if (sameOriginReferrer && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <Btn
      type="button"
      variant="secondary"
      onClick={handleClick}
      className={className}
      fullWidth={fullWidth}
    >
      {label ?? t("back")}
    </Btn>
  );
}
