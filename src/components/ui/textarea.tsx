import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "textarea-surface flex min-h-28 w-full border px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[var(--text-muted)] focus:border-[var(--border-brand)] focus:ring-2 focus:ring-[var(--brand-soft)]",
        className,
      )}
      {...props}
    />
  );
}
