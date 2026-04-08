import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function AboutPage() {
  const t = await getTranslations("About");
  const common = await getTranslations("Common");

  const features = [
    { title: t("whatItem1Title"), body: t("whatItem1Body") },
    { title: t("whatItem2Title"), body: t("whatItem2Body") },
    { title: t("whatItem3Title"), body: t("whatItem3Body") },
    { title: t("whatItem4Title"), body: t("whatItem4Body") },
    { title: t("whatItem5Title"), body: t("whatItem5Body") },
  ];

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

            <h2>{t("whyTitle")}</h2>
            <p>{t("whyBody1")}</p>
            <p>{t("whyBody2")}</p>

            <h2>{t("whatTitle")}</h2>
            <ul>
              {features.map((f) => (
                <li key={f.title}>
                  <strong>{f.title}</strong> {f.body}
                </li>
              ))}
            </ul>

            <h2>{t("notTitle")}</h2>
            <p>{t("notBody")}</p>

            <h2>{t("whoTitle")}</h2>
            <p>{t("whoBody")}</p>
            <p>{t("whoOutro")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
