import { Coins, ReceiptText, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { RecentGroupsSection } from "@/components/recent-groups-section";
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
    <main className="min-h-screen bg-[var(--bg-page)] px-4 py-5 sm:py-7">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:gap-7">
        <div className="flex items-center justify-end">
          <LocaleSwitcher currentLocale={locale} href="/" />
        </div>

        {/* Hero */}
        <section className="rounded-2xl bg-[var(--bg-hero)] px-5 py-12 text-center sm:px-8 sm:py-16">
          <p className="text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-[var(--text-on-brand)] sm:text-5xl">
            {common("appName")}
          </p>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/88 sm:text-lg">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/groups/new"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-7 text-[15px] font-semibold text-[var(--brand-primary)] transition-colors hover:bg-white/92 sm:h-10"
            >
              {t("primaryCta")}
            </Link>
            <p className="text-sm text-white/68">
              {t("ctaHint")}
            </p>
          </div>
        </section>

        {/* Recent Groups */}
        <section className="space-y-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
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
        </section>

        {/* Features */}
        <section className="grid gap-3 sm:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-[var(--border-default)] bg-[var(--bg-card)] shadow-none"
            >
              <CardContent className="space-y-3 p-4">
                <feature.icon className="h-5 w-5 text-[var(--brand-primary)]" />
                <div className="space-y-1.5">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                    {feature.title}
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {feature.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
