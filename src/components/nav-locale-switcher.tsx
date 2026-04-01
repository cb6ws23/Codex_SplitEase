"use client";

import { LOCALES, type AppLocale } from "@/lib/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const LOCALE_SHORT: Record<AppLocale, string> = {
  en: "EN",
  ja: "JA",
  "zh-CN": "中文",
};

export function NavLocaleSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale() as AppLocale;

  return (
    <nav aria-label="Language" className="nav-locale">
      {LOCALES.map((locale, i) => (
        <span key={locale} className="inline-flex items-center gap-1.5">
          {i > 0 ? <span aria-hidden="true" className="text-[var(--border-strong)]">·</span> : null}
          <Link
            href={pathname}
            locale={locale}
            className={
              locale === currentLocale
                ? "font-semibold text-[var(--text)]"
                : "text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            }
          >
            {LOCALE_SHORT[locale]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
