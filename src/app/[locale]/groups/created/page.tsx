import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Link2 } from "lucide-react";

import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { ShareLinkButton } from "@/components/group/share-link-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
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
    <main className="min-h-screen bg-[var(--bg-page)] px-3 py-4 sm:px-4 sm:py-6">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${group.slug}`} className="text-sm font-medium text-[var(--text-secondary)]">
            {common("group")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/groups/created?slug=${group.slug}`} />
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[var(--color-success)]" />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                {t("title")}
              </h1>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {t("description", { name: group.name })}
              </p>
            </div>
          </div>

          {/* Group link */}
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[var(--brand-primary)]" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">{t("linkTitle")}</p>
              </div>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {t("linkDescription")}
              </p>
              <div className="mt-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card-hover)] px-4 py-3 text-xs break-all text-[var(--text-secondary)]">
                {groupUrl}
              </div>
              <div className="mt-3">
                <ShareLinkButton
                  copiedLabel={common("copied")}
                  copyLabel={common("copy")}
                  url={groupUrl}
                />
              </div>
            </div>

            {/* Next steps */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{t("nextTitle")}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {t("nextDescription")}
              </p>
              <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <div className="rounded-lg bg-[var(--bg-card-hover)] px-4 py-3">
                  <p>{t("stepOne")}</p>
                </div>
                <div className="rounded-lg bg-[var(--bg-card-hover)] px-4 py-3">
                  <p>{t("stepTwo")}</p>
                </div>
              </div>
            </div>

            <Link href={`/g/${group.slug}`}>
              <Button className="w-full" size="lg">
                {t("continue")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
