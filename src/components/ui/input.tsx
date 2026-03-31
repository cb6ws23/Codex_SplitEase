import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-brand)] focus:ring-2 focus:ring-[var(--brand-primary-light)]",
        className,
      )}
      {...props}
    />
  );
}
