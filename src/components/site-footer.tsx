import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="site-footer">
      <nav className="site-footer-links">
        <Link href="/about">{t("about")}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacy">{t("privacy")}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/terms">{t("terms")}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/contact">{t("contact")}</Link>
      </nav>
      <p className="site-footer-copy">{t("copyright")}</p>
    </footer>
  );
}
