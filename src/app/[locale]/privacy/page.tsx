import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");
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

            <h2>{t("collectTitle")}</h2>
            <p>{t("collectIntro")}</p>
            <ul>
              <li>{t("collectItem1")}</li>
              <li>{t("collectItem2")}</li>
              <li>{t("collectItem3")}</li>
              <li>{t("collectItem4")}</li>
            </ul>

            <p>{t("notCollectIntro")}</p>
            <ul>
              <li>{t("notCollectItem1")}</li>
              <li>{t("notCollectItem2")}</li>
              <li>{t("notCollectItem3")}</li>
              <li>{t("notCollectItem4")}</li>
              <li>{t("notCollectItem5")}</li>
            </ul>

            <h2>{t("localStorageTitle")}</h2>
            <p>{t("localStorageIntro")}</p>
            <ul>
              <li>{t("localStorageItem1")}</li>
              <li>{t("localStorageItem2")}</li>
            </ul>
            <p>{t("localStorageNote")}</p>

            <h2>{t("storageTitle")}</h2>
            <p>{t("storageBody")}</p>

            <h2>{t("accessTitle")}</h2>
            <p>{t("accessBody")}</p>
            <p>{t("noSellBody")}</p>

            <h2>{t("retentionTitle")}</h2>
            <p>{t("retentionBody")}</p>

            <h2>{t("childrenTitle")}</h2>
            <p>{t("childrenBody")}</p>

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
