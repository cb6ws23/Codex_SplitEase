import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Decimal from "decimal.js";

import { FormStatusMessage } from "@/components/form-status-message";
import { coerceSupportedCurrency, type AppLocale } from "@/lib/constants";
import { computeGroupSummary, getGroupBySlug } from "@/lib/groups";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/money";

export default async function SettlementPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [group, common, pageT, feedback] = await Promise.all([
    getGroupBySlug(slug),
    getTranslations("Common"),
    getTranslations("GroupPage"),
    getTranslations("Feedback"),
  ]);

  if (!group) {
    notFound();
  }
  const currency = coerceSupportedCurrency(group.currency);

  let summary;
  let hasSummaryError = false;

  try {
    summary = computeGroupSummary(group);
  } catch {
    hasSummaryError = true;
    summary = {
      expenseSummaries: [],
      balances: [],
      settlements: [],
      totalExpenseAmount: new Decimal(0),
    };
  }

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="page-shell" style={{ maxWidth: 580 }}>
        <div className="setup-stack">
          {/* Back link */}
          <div className="page-topbar">
            <Link
              href={`/g/${slug}`}
              className="page-back-link inline-flex items-center gap-1.5"
              style={{ color: "var(--brand)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {common("group")}
            </Link>
          </div>

          {/* Page header (outside cards) */}
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              {common("settlements")}
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--text-soft)",
              }}
            >
              {pageT("settlementIntro")}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--brand)]">
              {common("currency")}: {currency}
            </p>
            {hasSummaryError ? (
              <div className="mt-4">
                <FormStatusMessage message={feedback("error")} tone="error" />
              </div>
            ) : null}
          </div>

          {/* Balances */}
          <div className="workspace-card">
            <h2 className="section-title" style={{ margin: 0 }}>
              {common("balances")}
            </h2>
            <p className="section-subtitle" style={{ marginTop: 4 }}>
              {pageT("balancesIntro")}
            </p>
            <div style={{ marginTop: 16 }}>
              {summary.balances.length === 0 ? (
                <p style={{ padding: "16px 0", fontSize: 14, color: "var(--text-soft)" }}>
                  {pageT("emptyMembers")}
                </p>
              ) : (
                summary.balances.map((balance) => (
                  <div key={balance.memberId} className="balance-row">
                    <span className="text-sm font-medium text-[var(--text)]">
                      {balance.memberName}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        balance.balance.isNegative()
                          ? "text-[var(--danger)]"
                          : balance.balance.isZero()
                            ? "text-[var(--text-soft)]"
                            : "text-[var(--success)]"
                      }`}
                    >
                      {formatMoney(locale, currency, balance.balance)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Raw expense records */}
          <div className="workspace-card">
            <h2 className="section-title" style={{ margin: 0 }}>
              {pageT("rawExpensesTitle")}
            </h2>
            <p className="section-subtitle" style={{ marginTop: 4 }}>
              {pageT("rawExpensesIntro")}
            </p>
            <div style={{ marginTop: 16 }}>
              {group.expenses.length === 0 ? (
                <p style={{ padding: "16px 0", fontSize: 14, color: "var(--text-soft)" }}>
                  {pageT("emptyExpenses")}
                </p>
              ) : (
                group.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="balance-row"
                  >
                    <div>
                      <p
                        className="text-sm font-semibold text-[var(--text)]"
                        style={{ margin: 0 }}
                      >
                        {expense.title}
                      </p>
                      <p
                        className="text-xs text-[var(--text-muted)]"
                        style={{ margin: "2px 0 0" }}
                      >
                        {expense.happenedOn.toISOString().slice(0, 10)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--text)]">
                      {formatMoney(locale, currency, expense.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recommended transfers */}
          <div className="workspace-card">
            <h2 className="section-title" style={{ margin: 0 }}>
              {common("settlements")}
            </h2>
            <p className="section-subtitle" style={{ marginTop: 4 }}>
              {pageT("recommendedTransfersIntro")}
            </p>
            <div style={{ marginTop: 16 }}>
              {summary.settlements.length === 0 ? (
                <p style={{ padding: "16px 0", fontSize: 14, color: "var(--text-soft)" }}>
                  {pageT("settlementEmpty")}
                </p>
              ) : (
                summary.settlements.map((settlement) => (
                  <div
                    key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                    className="balance-row"
                  >
                    <span className="text-sm font-medium text-[var(--text)]">
                      {pageT("settlementLine", {
                        from: settlement.fromMemberName,
                        to: settlement.toMemberName,
                        amount: formatMoney(locale, currency, settlement.amount),
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
