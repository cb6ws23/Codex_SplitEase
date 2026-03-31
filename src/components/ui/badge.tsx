import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--border-default)] bg-[var(--brand-primary-light)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-primary)]",
        className,
      )}
      {...props}
    />
  );
}
