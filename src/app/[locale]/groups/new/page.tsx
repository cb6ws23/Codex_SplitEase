import { getTranslations } from "next-intl/server";

import { MemberChipsInput } from "@/components/group/member-chips-input";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { FormStatusMessage } from "@/components/form-status-message";
import { PendingButton } from "@/components/pending-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { createGroupAction } from "@/lib/actions";
import { type AppLocale } from "@/lib/constants";

export default async function NewGroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ locale }, { status }] = await Promise.all([params, searchParams]);
  const [t, common, feedback] = await Promise.all([
    getTranslations("GroupForm"),
    getTranslations("Common"),
    getTranslations("Feedback"),
  ]);

  return (
    <main className="min-h-screen bg-[var(--page-background)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-[var(--muted-foreground)]">
            {common("backHome")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href="/groups/new" />
        </div>

        <Card className="overflow-hidden border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,243,234,0.96))] shadow-[0_20px_52px_rgba(22,32,51,0.06)]">
          <CardHeader className="gap-4 border-b border-[var(--border)]/70 bg-white/65 px-5 py-5 sm:px-6">
            <Badge className="w-fit">{common("currency")}</Badge>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-sm font-semibold text-[var(--foreground)] shadow-[0_10px_24px_rgba(22,32,51,0.06)]">
                  S
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-xl">
                    {common("appName")}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                    {t("brandHint")}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">{t("title")}</CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base">
                  {t("description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            {status === "invalidGroup" ? (
              <FormStatusMessage message={feedback("invalidGroup")} tone="error" />
            ) : null}
            <form action={createGroupAction} className="space-y-5">
              <input name="locale" type="hidden" value={locale} />

              <div className="rounded-3xl border border-[var(--border)] bg-white px-4 py-4 sm:px-5">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("groupName")}</Label>
                  <Input
                    id="name"
                    maxLength={80}
                    name="name"
                    placeholder={t("groupNamePlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-white px-4 py-4 sm:px-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="initialMembers">{t("membersLabel")}</Label>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {common("optional")}
                    </span>
                  </div>
                  <MemberChipsInput
                    addLabel={common("add")}
                    helperText={t("membersHint")}
                    inputPlaceholder={t("membersPlaceholder")}
                    inputTitle={t("membersLabel")}
                    maxMembersText={t("membersLimit")}
                    name="initialMembers"
                  />
                </div>
              </div>

              <PendingButton
                className="w-full"
                idleLabel={t("submit")}
                pendingLabel={feedback("creating")}
                size="lg"
                type="submit"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
