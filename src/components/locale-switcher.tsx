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
      className="inline-grid grid-cols-3 gap-1 rounded-2xl border border-[var(--border)] bg-white/94 p-1 shadow-[0_8px_20px_rgba(15,23,42,0.05)] backdrop-blur-sm"
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={href}
          locale={locale}
          style={
            locale === currentLocale
              ? {
                  backgroundColor: "#0f172a",
                  color: "#fffdf8",
                  opacity: 1,
                }
              : undefined
          }
          className={cn(
            "block min-w-[5.25rem] rounded-xl px-3 py-2 text-center text-xs font-semibold leading-5 no-underline opacity-100 transition-colors sm:min-w-[5.75rem]",
            locale === currentLocale
              ? "border border-[#0f172a] !text-[#fffdf8] font-bold"
              : "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
          )}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
