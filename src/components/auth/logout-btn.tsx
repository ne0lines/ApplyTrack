"use client";

import { Btn } from "@/components/ui/btn";
import { useClerk } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

type LogoutBtnProps = {
  className?: string;
};

export function LogoutBtn({ className }: Readonly<LogoutBtnProps>) {
  const { signOut } = useClerk();
  const t = useTranslations();

  return (
    <Btn
      className={className}
      onClick={() => signOut({ redirectUrl: "/" })}
      variant="red"
    >
      {t("logout")}
    </Btn>
  );
}
