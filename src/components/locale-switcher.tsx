import { LOCALES, type AppLocale } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  currentLocale: AppLocale;
  href: string;
};

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
};

export function LocaleSwitcher({ currentLocale, href }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white/88 p-1 shadow-[0_8px_20px_rgba(15,23,42,0.05)] backdrop-blur-sm">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
          className={cn(
            "inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold leading-none transition-colors sm:min-w-[5rem]",
            locale === currentLocale
              ? "border border-[color-mix(in_oklab,var(--foreground)_14%,white)] bg-[var(--foreground)] text-white shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
          )}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
