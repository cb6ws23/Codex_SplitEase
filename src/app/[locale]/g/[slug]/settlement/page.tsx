import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Decimal from "decimal.js";

import { FormStatusMessage } from "@/components/form-status-message";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { type AppLocale } from "@/lib/constants";
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
    <main className="min-h-screen bg-[var(--bg-page)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${slug}`} className="text-sm font-medium text-[var(--text-secondary)]">
            {common("group")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/g/${slug}/settlement`} />
        </div>

        {/* Intro */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {common("settlements")}
          </h1>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("settlementIntro")}
          </p>
          {hasSummaryError ? (
            <div className="mt-4">
              <FormStatusMessage message={feedback("error")} tone="error" />
            </div>
          ) : null}
        </div>

        {/* Balances */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {common("balances")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("balancesIntro")}
          </p>
          <div className="mt-4 space-y-3">
            {summary.balances.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--border-default)] px-4 py-5 text-sm text-[var(--text-secondary)]">
                {pageT("emptyMembers")}
              </p>
            ) : (
              summary.balances.map((balance) => (
                <div
                  key={balance.memberId}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-3"
                >
                  <span className="font-medium text-[var(--text-primary)]">
                    {balance.memberName}
                  </span>
                  <span
                    className={
                      balance.balance.isNegative()
                        ? "font-semibold text-[var(--color-danger)]"
                        : balance.balance.isZero()
                          ? "text-[var(--text-muted)]"
                          : "font-semibold text-[var(--color-success)]"
                    }
                  >
                    {formatMoney(locale, balance.balance)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Raw expense records */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {pageT("rawExpensesTitle")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("rawExpensesIntro")}
          </p>
          <div className="mt-4 space-y-3">
            {group.expenses.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--border-default)] px-4 py-5 text-sm text-[var(--text-secondary)]">
                {pageT("emptyExpenses")}
              </p>
            ) : (
              group.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {expense.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                        {expense.happenedOn.toISOString().slice(0, 10)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {formatMoney(locale, expense.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended transfers */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {common("settlements")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("recommendedTransfersIntro")}
          </p>
          <div className="mt-4 space-y-3">
            {summary.settlements.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--border-default)] px-4 py-5 text-sm text-[var(--text-secondary)]">
                {pageT("settlementEmpty")}
              </p>
            ) : (
              summary.settlements.map((settlement) => (
                <div
                  key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                  className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-3 text-sm"
                >
                  <p className="font-semibold text-[var(--text-primary)]">
                    {pageT("settlementLine", {
                      from: settlement.fromMemberName,
                      to: settlement.toMemberName,
                      amount: formatMoney(locale, settlement.amount),
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
