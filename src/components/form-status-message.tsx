import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "success" | "error" | "info";

type Props = {
  message: string;
  tone?: Tone;
  className?: string;
};

const toneStyles: Record<Tone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-amber-200 bg-amber-50 text-amber-900",
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function FormStatusMessage({
  message,
  tone = "info",
  className,
}: Props) {
  const Icon = icons[tone];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6",
        toneStyles[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
