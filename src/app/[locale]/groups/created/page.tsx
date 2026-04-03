import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { ShareLinkButton } from "@/components/group/share-link-button";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { coerceSupportedCurrency, type AppLocale } from "@/lib/constants";
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
  const currency = coerceSupportedCurrency(group.currency);

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
  const groupUrl = `${appUrl}/${locale}/g/${group.slug}`;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />

      <div className="page-shell" style={{ maxWidth: 560 }}>
        <div className="setup-stack">
          {/* Back link */}
          <div className="page-topbar">
            <Link
              href="/"
              className="page-back-link inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {common("backHome")}
            </Link>
          </div>

          {/* Success banner */}
          <div className="success-banner">
            <CheckCircle2
              className="mx-auto mb-3 text-[var(--success)]"
              style={{ width: 36, height: 36 }}
            />
            <h1 className="success-title">{t("title")}</h1>
            <p className="success-text">
              {t("description", { name: group.name })}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--brand)]">
              {common("currency")}: {currency}
            </p>
          </div>

          {/* Share URL section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-muted)",
              }}
            >
              {t("linkDescription")}
            </p>
            <ShareLinkButton
              copiedLabel={common("copied")}
              copyLabel={common("copy")}
              inline
              url={groupUrl}
            />
          </div>

          {/* Action buttons */}
          <div className="action-row" style={{ marginTop: 8 }}>
            <ShareLinkButton
              copiedLabel={common("copied")}
              copyLabel={common("shareLink")}
              url={groupUrl}
            />
            <Link href={`/g/${group.slug}`}>
              <Button
                size="lg"
                style={{
                  borderRadius: 9999,
                  paddingInline: 32,
                  width: "auto",
                }}
              >
                {t("continue")} →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
