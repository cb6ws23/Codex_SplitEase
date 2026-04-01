import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Link2 } from "lucide-react";

import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { ShareLinkButton } from "@/components/group/share-link-button";
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
    <main className="min-h-screen bg-[var(--bg-page)]">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="page-shell setup-shell">
        <div className="setup-stack">
          <div className="page-topbar">
            <Link href={`/g/${group.slug}`} className="page-back-link">
              {common("group")}
            </Link>
          </div>

          <div className="app-card p-5 sm:p-7">
            <div className="setup-header">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 shadow-[var(--shadow-sm)]">
                <div className="brand-mark h-9 w-9 rounded-[12px] text-sm">S</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {common("appName")}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{common("currency")}</p>
                </div>
              </div>

              <div className="app-card-muted flex items-start gap-3 p-4">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[var(--success)]" />
                <div className="stack-sm">
                  <h1 className="setup-title">{t("title")}</h1>
                  <p className="setup-text">{t("description", { name: group.name })}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 stack-md">
              <div className="utility-card p-4">
                <div className="stack-sm">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[var(--brand)]" />
                    <p className="text-sm font-semibold text-[var(--text)]">{t("linkTitle")}</p>
                  </div>
                  <p className="text-sm leading-6 text-[var(--text-soft)]">
                    {t("linkDescription")}
                  </p>
                </div>
                <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs break-all text-[var(--text-soft)]">
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

              <div className="utility-card p-4">
                <p className="text-sm font-semibold text-[var(--text)]">{t("nextTitle")}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                  {t("nextDescription")}
                </p>
                <div className="mt-4 stack-sm text-sm text-[var(--text-soft)]">
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <p>{t("stepOne")}</p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <p>{t("stepTwo")}</p>
                  </div>
                </div>
              </div>

              <div className="utility-card p-4">
                <Link href={`/g/${group.slug}`}>
                  <Button className="w-full" size="lg">
                    {t("continue")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
