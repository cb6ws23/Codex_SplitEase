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
    <div className="inline-flex rounded-full border border-[var(--border)] bg-white/80 p-1 backdrop-blur-sm">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
          className={cn(
            "rounded-full px-3 py-2 text-xs font-semibold transition-colors",
            locale === currentLocale
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]",
          )}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}
