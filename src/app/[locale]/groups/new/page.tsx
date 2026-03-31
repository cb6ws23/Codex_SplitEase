import { getTranslations } from "next-intl/server";

import { MemberChipsInput } from "@/components/group/member-chips-input";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { FormStatusMessage } from "@/components/form-status-message";
import { PendingButton } from "@/components/pending-button";
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
    <main className="min-h-screen bg-[var(--bg-page)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto flex max-w-lg flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-[var(--text-secondary)]">
            {common("backHome")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href="/groups/new" />
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              {t("title")}
            </h1>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {t("description")}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {status === "invalidGroup" ? (
              <FormStatusMessage message={feedback("invalidGroup")} tone="error" />
            ) : null}

            <form action={createGroupAction} className="space-y-5">
              <input name="locale" type="hidden" value={locale} />

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

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="initialMembers">{t("membersLabel")}</Label>
                  <span className="text-xs text-[var(--text-muted)]">
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

              <PendingButton
                className="w-full"
                idleLabel={t("submit")}
                pendingLabel={feedback("creating")}
                size="lg"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
