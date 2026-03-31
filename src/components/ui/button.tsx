import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-[15px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] px-4 py-2 text-[var(--text-on-brand)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-dark)]",
        secondary:
          "border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]",
        ghost:
          "px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-card)]",
        destructive:
          "bg-[var(--color-danger)] px-4 py-2 text-white hover:bg-[color-mix(in_oklab,var(--color-danger)_88%,black)]",
      },
      size: {
        default: "h-11 sm:h-10",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
