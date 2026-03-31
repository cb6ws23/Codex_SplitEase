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

        <Card className="overflow-hidden border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,238,0.96))] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <CardHeader className="gap-4 border-b border-[var(--border)]/70 bg-white/65 px-5 py-5 sm:px-6">
            <Badge className="w-fit">{common("currency")}</Badge>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {common("appName")}
              </p>
              <CardTitle className="text-2xl sm:text-3xl">{t("title")}</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base">
                {t("description")}
              </CardDescription>
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
                className="w-full shadow-[0_14px_30px_rgba(217,119,6,0.16)]"
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
