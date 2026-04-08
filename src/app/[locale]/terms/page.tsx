import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function TermsPage() {
  const t = await getTranslations("Terms");
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

            <h2>{t("aboutTitle")}</h2>
            <p>{t("aboutBody")}</p>

            <h2>{t("useTitle")}</h2>
            <p>{t("useIntro")}</p>
            <ul>
              <li>{t("useItem1")}</li>
              <li>{t("useItem2")}</li>
              <li>{t("useItem3")}</li>
              <li>{t("useItem4")}</li>
              <li>{t("useItem5")}</li>
            </ul>

            <h2>{t("dataTitle")}</h2>
            <p>{t("dataBody1")}</p>
            <p>{t("dataBody2")}</p>

            <h2>{t("noAccountTitle")}</h2>
            <p>{t("noAccountBody")}</p>

            <h2>{t("availabilityTitle")}</h2>
            <p>{t("availabilityBody")}</p>

            <h2>{t("liabilityTitle")}</h2>
            <p>{t("liabilityBody")}</p>

            <h2>{t("changesTitle")}</h2>
            <p>{t("changesBody")}</p>

            <h2>{t("contactTitle")}</h2>
            <p>{t("contactBody")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
