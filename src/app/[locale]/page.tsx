import { Coins, ReceiptText, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { RecentGroupsSection } from "@/components/recent-groups-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { type AppLocale } from "@/lib/constants";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Home");
  const common = await getTranslations("Common");

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

  return (
    <main className="min-h-screen bg-[var(--page-background)] px-4 py-5 text-[var(--foreground)] sm:py-7">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:gap-7">
        <div className="flex items-center justify-between gap-4">
          <Badge>{common("currency")}</Badge>
          <LocaleSwitcher currentLocale={locale} href="/" />
        </div>

        <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[radial-gradient(circle_at_top_left,rgba(247,201,72,0.34),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(44,123,229,0.18),transparent_42%),linear-gradient(180deg,#fff8ee_0%,#ffffff_100%)] px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              <div className="space-y-3">
                <Badge className="bg-white/85">{t("badge")}</Badge>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
                  {common("appName")}
                </p>
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
                  {t("title")}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                  {t("description")}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/groups/new">
                  <Button className="h-12 w-full px-6 text-base shadow-[0_14px_30px_rgba(217,119,6,0.18)] sm:w-auto" size="lg">
                    {t("primaryCta")}
                  </Button>
                </Link>
                <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                  {t("ctaHint")}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-white/70 bg-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <CardContent className="space-y-3 p-4">
                    <feature.icon className="h-5 w-5 text-[var(--accent-strong)]" />
                    <div className="space-y-1.5">
                      <h2 className="text-sm font-semibold sm:text-base">{feature.title}</h2>
                      <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                        {feature.body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {t("recentEyebrow")}
            </p>
            <RecentGroupsSection
              description={t("recentDescription")}
              empty={t("recentEmpty")}
              openLabel={t("recentOpen")}
              removeHint={t("recentRemoveHint")}
              removeLabel={t("recentRemove")}
              title={t("recentTitle")}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
