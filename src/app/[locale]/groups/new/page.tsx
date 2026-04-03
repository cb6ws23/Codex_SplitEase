import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MemberChipsInput } from "@/components/group/member-chips-input";
import { FormStatusMessage } from "@/components/form-status-message";
import { PendingButton } from "@/components/pending-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { createGroupAction } from "@/lib/actions";
import {
  getCurrencyDisplayName,
  SUPPORTED_CURRENCIES,
  type AppLocale,
} from "@/lib/constants";

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
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="page-shell" style={{ maxWidth: 680 }}>
        <div className="setup-stack">
          {/* Back link */}
          <div className="page-topbar">
            <Link href="/" className="page-back-link inline-flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              {common("backHome")}
            </Link>
          </div>

          {/* Form card */}
          <div className="form-card">
            {/* Header */}
            <div className="flex flex-wrap items-start gap-3">
              <h1 style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 650, color: "var(--text)", margin: 0 }}>
                {t("title")}
              </h1>
              <span className="eyebrow" style={{ fontSize: 11, padding: "4px 10px", marginTop: 4 }}>
                {common("currency")}
              </span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-soft)", margin: "10px 0 0", maxWidth: 440 }}>
              {t("description")}
            </p>

            {/* Status */}
            {status === "invalidGroup" ? (
              <div className="mt-5">
                <FormStatusMessage message={feedback("invalidGroup")} tone="error" />
              </div>
            ) : null}

            {/* Form */}
            <form action={createGroupAction} className="mt-7" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <input name="locale" type="hidden" value={locale} />

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label htmlFor="name" className="text-[14px] font-medium text-[var(--text)]">
                  {t("groupName")}
                </Label>
                <Input
                  id="name"
                  maxLength={80}
                  name="name"
                  placeholder={t("groupNamePlaceholder")}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label htmlFor="currency" className="text-[14px] font-medium text-[var(--text)]">
                  {t("currencyLabel")}
                </Label>
                <select
                  id="currency"
                  name="currency"
                  className="input-surface flex h-11 w-full border px-4 py-2 text-sm text-[var(--text)] outline-none transition-[border-color,box-shadow,background-color] focus:border-[var(--border-brand)] focus:ring-2 focus:ring-[var(--brand-soft)]"
                  defaultValue="JPY"
                  required
                >
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency} · {getCurrencyDisplayName(locale, currency)}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                  {t("currencyHint")}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="flex items-center gap-2">
                  <Label htmlFor="initialMembers" className="text-[14px] font-medium text-[var(--text)]">
                    {t("membersLabel")}
                  </Label>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
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
                className="self-start"
                idleLabel={t("submit")}
                pendingLabel={feedback("creating")}
                size="lg"
                type="submit"
                style={{ borderRadius: 9999, paddingInline: 40, width: "auto" }}
              />
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
