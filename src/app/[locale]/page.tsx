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
    <main className="min-h-screen bg-[var(--page-background)] px-4 py-6 text-[var(--foreground)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Badge>{common("currency")}</Badge>
          <LocaleSwitcher currentLocale={locale} href="/" />
        </div>

        <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[radial-gradient(circle_at_top_left,rgba(247,201,72,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(44,123,229,0.18),transparent_42%),linear-gradient(180deg,#fff7eb_0%,#ffffff_100%)] p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-white/80">{t("badge")}</Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
              {t("description")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/groups/new">
                <Button className="w-full sm:w-auto" size="lg">
                  {t("primaryCta")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="space-y-4 p-5">
                <feature.icon className="h-6 w-6 text-[var(--accent-strong)]" />
                <div className="space-y-2">
                  <h2 className="text-base font-semibold">{feature.title}</h2>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                    {feature.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <RecentGroupsSection
          description={t("recentDescription")}
          empty={t("recentEmpty")}
          openLabel={t("recentOpen")}
          title={t("recentTitle")}
        />
      </div>
    </main>
  );
}
