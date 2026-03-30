import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Decimal from "decimal.js";

import { FormStatusMessage } from "@/components/form-status-message";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="min-h-screen bg-[var(--page-background)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${slug}`} className="text-sm font-medium text-[var(--muted-foreground)]">
            {common("group")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/g/${slug}/settlement`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{common("settlements")}</CardTitle>
            <CardDescription>{pageT("settlementIntro")}</CardDescription>
          </CardHeader>
          {hasSummaryError ? (
            <CardContent className="pt-0">
              <FormStatusMessage message={feedback("error")} tone="error" />
            </CardContent>
          ) : null}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{common("balances")}</CardTitle>
            <CardDescription>{pageT("balancesIntro")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.balances.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--muted-foreground)]">
                {pageT("emptyMembers")}
              </p>
            ) : (
              summary.balances.map((balance) => (
                <div
                  key={balance.memberId}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <span className="font-medium">{balance.memberName}</span>
                  <span
                    className={
                      balance.balance.isNegative()
                        ? "text-[var(--destructive)]"
                        : balance.balance.isZero()
                          ? "text-[var(--muted-foreground)]"
                          : "text-[var(--success)]"
                    }
                  >
                    {formatMoney(locale, balance.balance)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{pageT("rawExpensesTitle")}</CardTitle>
            <CardDescription>{pageT("rawExpensesIntro")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.expenses.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--muted-foreground)]">
                {pageT("emptyExpenses")}
              </p>
            ) : (
              group.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {expense.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                        {expense.happenedOn.toISOString().slice(0, 10)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {formatMoney(locale, expense.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{common("settlements")}</CardTitle>
            <CardDescription>{pageT("recommendedTransfersIntro")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.settlements.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-5 text-sm text-[var(--muted-foreground)]">
                {pageT("settlementEmpty")}
              </p>
            ) : (
              summary.settlements.map((settlement) => (
                <div
                  key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                  className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
                >
                  <p className="font-medium">
                    {pageT("settlementLine", {
                      from: settlement.fromMemberName,
                      to: settlement.toMemberName,
                      amount: formatMoney(locale, settlement.amount),
                    })}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
