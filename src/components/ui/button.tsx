import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[15px] font-semibold transition-[transform,box-shadow,background-color,border-color,color] duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[var(--brand)] px-4 py-2 text-[var(--text-inverse)] shadow-[var(--shadow-sm)] hover:-translate-y-px hover:bg-[var(--brand-strong)] hover:shadow-[var(--shadow-md)] active:translate-y-0",
        secondary:
          "border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[var(--text)] shadow-[var(--shadow-sm)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]",
        outline:
          "border border-[var(--brand)] bg-transparent px-4 py-2 text-[var(--brand)] hover:bg-[rgba(99,91,255,0.05)]",
        ghost:
          "px-3 py-2 text-[var(--text-soft)] hover:bg-[var(--surface-muted)]",
        destructive:
          "border border-transparent bg-[var(--danger)] px-4 py-2 text-white shadow-[var(--shadow-sm)] hover:bg-[color-mix(in_oklab,var(--danger)_88%,black)]",
      },
      size: {
        default: "h-11 sm:h-10",
        sm: "h-9 px-3 text-xs",
        lg: "h-[52px] px-5",
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
