import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Link2 } from "lucide-react";

import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { ShareLinkButton } from "@/components/group/share-link-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { type AppLocale } from "@/lib/constants";
import { getGroupBySlug } from "@/lib/groups";

export default async function GroupCreatedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ slug?: string }>;
}) {
  const [{ locale }, { slug }] = await Promise.all([params, searchParams]);

  if (!slug) {
    redirect(`/${locale}/groups/new`);
  }

  const [group, t, common] = await Promise.all([
    getGroupBySlug(slug),
    getTranslations("GroupCreated"),
    getTranslations("Common"),
  ]);

  if (!group) {
    notFound();
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
  const groupUrl = `${appUrl}/${locale}/g/${group.slug}`;

  return (
    <main className="min-h-screen bg-[var(--page-background)] px-3 py-4 sm:px-4 sm:py-6">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${group.slug}`} className="text-sm font-medium text-[var(--muted-foreground)]">
            {common("group")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/groups/created?slug=${group.slug}`} />
        </div>

        <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,238,0.96))]">
          <CardHeader>
            <Badge className="w-fit">{common("currency")}</Badge>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 text-[var(--success)]" />
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {common("appName")}
                </p>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description", { name: group.name })}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-white sm:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[var(--accent-strong)]" />
                    <CardTitle className="text-base">{t("linkTitle")}</CardTitle>
                  </div>
                  <CardDescription>{t("linkDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-xs break-all text-[var(--muted-foreground)]">
                    {groupUrl}
                  </div>
                  <ShareLinkButton
                    copiedLabel={common("copied")}
                    copyLabel={common("copy")}
                    url={groupUrl}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base">{t("nextTitle")}</CardTitle>
                <CardDescription>{t("nextDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <p>{t("stepOne")}</p>
                <p>{t("stepTwo")}</p>
              </CardContent>
            </Card>

            <Link href={`/g/${group.slug}`}>
              <Button className="w-full" size="lg">
                {t("continue")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
