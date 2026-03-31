"use client";

import { trackEvent } from "@/lib/analytics";
import { Btn } from "@/components/ui/btn";
import { Plus } from "lucide-react";

export function AddJobBtn() {
  return (
    <Btn
      className="md:hidden"
      href="/jobb/new"
      icon={Plus}
      onClick={() => trackEvent("add_job_click", { location: "dashboard" })}
    >
      Lägg till jobb
    </Btn>
  );
}
