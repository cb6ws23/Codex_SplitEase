import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function ContactPage() {
  const t = await getTranslations("Contact");
  const common = await getTranslations("Common");

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="page-shell" style={{ maxWidth: 720 }}>
        <div className="setup-stack">
          <div className="page-topbar">
            <Link
              href="/"
              className="page-back-link inline-flex items-center gap-1.5"
              style={{ color: "var(--brand)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {common("backHome")}
            </Link>
          </div>

          <div className="workspace-card legal-prose">
            <h1 className="legal-title">{t("title")}</h1>
            <p className="legal-subtitle">{t("subtitle")}</p>
            <p>{t("intro")}</p>

            <h2>{t("emailTitle")}</h2>
            <p>
              <a
                href={`mailto:${t("email")}`}
                style={{ color: "var(--brand)", textDecoration: "underline" }}
              >
                {t("email")}
              </a>
            </p>

            <h2>{t("whatTitle")}</h2>
            <p>{t("whatIntro")}</p>
            <ul>
              <li>{t("whatItem1")}</li>
              <li>{t("whatItem2")}</li>
              <li>{t("whatItem3")}</li>
              <li>{t("whatItem4")}</li>
              <li>{t("whatItem5")}</li>
            </ul>

            <h2>{t("responseTitle")}</h2>
            <p>{t("responseBody")}</p>

            <h2>{t("langTitle")}</h2>
            <p>{t("langBody")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
