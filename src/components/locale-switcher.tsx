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
    <nav
      aria-label="Language switcher"
      className="inline-grid grid-cols-3 gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-1"
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
          className={cn(
            "block min-w-[5.25rem] rounded-md px-3 py-2 text-center text-xs font-semibold leading-5 no-underline transition-colors sm:min-w-[5.75rem]",
            locale === currentLocale
              ? "bg-[var(--brand-primary)] text-[var(--text-on-brand)]"
              : "bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]",
          )}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
