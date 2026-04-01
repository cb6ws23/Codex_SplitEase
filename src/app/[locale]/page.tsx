import { Coins, ReceiptText, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { RecentGroupsSection } from "@/components/recent-groups-section";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Await params so Next.js resolves the dynamic segment
  await params;
  const t = await getTranslations("Home");

  const features = [
    {
      icon: ShieldCheck,
      title: t("featureOneTitle"),
      body: t("featureOneBody"),
    },
    {
      icon: Coins,
      title: t("featureTwoTitle"),
      body: t("featureTwoBody"),
    },
    {
      icon: ReceiptText,
      title: t("featureThreeTitle"),
      body: t("featureThreeBody"),
    },
  ];

  // Split headline into two lines for color treatment
  const headlineRaw = t("headline");
  const headlineLines = headlineRaw.split("\n");

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 30% 10%, rgba(99,91,255,0.07), transparent 60%), " +
          "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(0,212,255,0.05), transparent 50%), " +
          "linear-gradient(180deg, #eef0f8 0%, var(--bg) 520px)",
      }}
    >
      <div className="page-shell page-stack">
        {/* Hero */}
        <section className="home-hero">
          <div className="hero-content">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1 className="hero-headline">
              {headlineLines[0]}
              {headlineLines.length > 1 ? (
                <>
                  <br />
                  <span className="hero-headline-accent">{headlineLines[1]}</span>
                </>
              ) : null}
            </h1>
            <p className="hero-subtitle">{t("subtitle")}</p>
            <div className="hero-cta-block">
              <Link href="/groups/new" className="hero-primary-cta">
                {t("primaryCta")} <span aria-hidden="true">→</span>
              </Link>
              <p className="reassurance">
                <span className="reassurance-check" aria-hidden="true">✓</span>
                {t("reassurance")}
              </p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-stack" aria-hidden="true">
              <span className="hc" />
              <span className="hc" />
              <span className="hc" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="feature-grid">
          {features.map((feature) => (
            <Card key={feature.title} className="feature-card">
              <CardContent className="p-0">
                <div className="feature-icon">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h2 className="feature-title">{feature.title}</h2>
                <p className="feature-text">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Recent Groups */}
        <section className="stack-md">
          <div className="section-header">
            <p className="section-kicker">{t("recentEyebrow")}</p>
          </div>
          <RecentGroupsSection
            description={t("recentDescription")}
            empty={t("recentEmpty")}
            openLabel={t("recentOpen")}
            removeHint={t("recentRemoveHint")}
            removeLabel={t("recentRemove")}
            title={t("recentTitle")}
          />
        </section>
      </div>
    </main>
  );
}
