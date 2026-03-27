"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
  size?: number;
};

export function Loader({ className, size = 48 }: Readonly<LoaderProps>) {
  return (
    <span
      aria-hidden="true"
      className={cn("jobish-loader", className)}
      style={{ "--loader-size": `${size}px` } as CSSProperties}
    >
      <span className="jobish-loader__sprite">
        <span className="jobish-loader__rotor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="jobish-loader__icon"
            draggable={false}
            height={size}
            src="/icons/loader-icon.png"
            width={size}
          />
        </span>
      </span>
    </span>
  );
}