import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowRightLeft, FileDown, PenSquare, Plus } from "lucide-react";
import Decimal from "decimal.js";

import { FormStatusMessage } from "@/components/form-status-message";
import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { PendingButton } from "@/components/pending-button";
import { ShareLinkButton } from "@/components/group/share-link-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMemberAction } from "@/lib/actions";
import { type AppLocale } from "@/lib/constants";
import { computeGroupSummary, getGroupBySlug } from "@/lib/groups";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/money";

function statusMessage(
  status: string | undefined,
  feedback: Awaited<ReturnType<typeof getTranslations>>,
) {
  switch (status) {
    case "saved":
      return feedback("saved");
    case "deleted":
      return feedback("deleted");
    case "invalidMember":
      return feedback("invalidMember");
    case "error":
      return feedback("error");
    default:
      return null;
  }
}

function statusTone(status: string | undefined) {
  if (status === "saved" || status === "deleted") {
    return "success" as const;
  }

  if (status === "invalidMember" || status === "error") {
    return "error" as const;
  }

  return "info" as const;
}

export default async function GroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ locale, slug }, { status }] = await Promise.all([params, searchParams]);
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
  const notice = statusMessage(status, feedback);
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
  const groupUrl = `${appUrl}/${locale}/g/${group.slug}`;

  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="page-shell">
        <div className="workspace-layout">
          <div className="page-topbar">
            <Link href="/" className="page-back-link">
              {common("backHome")}
            </Link>
          </div>

          <div className="app-card p-5 sm:p-7">
            <div className="group-header">
              <div className="group-summary">
                <h1 className="break-words text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--text)]">
                  {group.name}
                </h1>
                <p className="text-sm leading-6 text-[var(--text-soft)]">
                  {pageT("memberCount", { count: group.members.length })} ·{" "}
                  {pageT("expenseCount", { count: group.expenses.length })}
                </p>
              </div>

              <div className="utility-card w-full p-4 sm:max-w-[360px]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {common("expenses")}
                    </p>
                    <p className="text-sm leading-6 text-[var(--text-soft)]">
                      {summary.totalExpenseAmount.equals(0)
                        ? pageT("emptyExpenses")
                        : formatMoney(locale, summary.totalExpenseAmount)}
                    </p>
                  </div>
                  {group.members.length > 0 ? (
                    <Link href={`/g/${slug}/expenses/new`}>
                      <Button className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        {pageT("addExpenseTitle")}
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full sm:w-auto" disabled>
                      <Plus className="mr-2 h-4 w-4" />
                      {pageT("addExpenseTitle")}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {notice ? (
              <div className="mt-5">
                <FormStatusMessage message={notice} tone={statusTone(status)} />
              </div>
            ) : null}
            {hasSummaryError ? (
              <div className="mt-5">
                <FormStatusMessage message={feedback("error")} tone="error" />
              </div>
            ) : null}
          </div>

          <section className="workspace-primary">
            <div className="expense-section app-card p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="stack-sm">
                  <h2 className="section-title !mb-0">{common("expenses")}</h2>
                  <p className="text-sm leading-6 text-[var(--text-soft)]">
                    {summary.totalExpenseAmount.equals(0)
                      ? pageT("emptyExpenses")
                      : formatMoney(locale, summary.totalExpenseAmount)}
                  </p>
                </div>
                {group.members.length > 0 ? (
                  <Link href={`/g/${slug}/expenses/new`}>
                    <Button className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      {pageT("addExpenseTitle")}
                    </Button>
                  </Link>
                ) : null}
              </div>

              <div className="mt-6 stack-md">
                {summary.expenseSummaries.length === 0 ? (
                  <div className="utility-card border-dashed px-5 py-6 text-sm text-[var(--text-soft)]">
                    <p className="font-semibold tracking-[-0.01em] text-[var(--text)]">
                      {pageT("emptyExpensesTitle")}
                    </p>
                    <p className="mt-2 leading-7 break-words">
                      {group.members.length === 0
                        ? pageT("emptyExpensesNoMembersBody")
                        : pageT("emptyExpensesReadyBody")}
                    </p>
                    <div className="app-card-muted mt-4 px-4 py-4">
                      <p className="section-kicker !mb-1">{pageT("emptyExpensesNextTitle")}</p>
                      <p className="text-sm leading-6 text-[var(--text)]">
                        {group.members.length === 0
                          ? pageT("addMemberFirstHint")
                          : pageT("emptyExpensesReadyAction")}
                      </p>
                    </div>
                  </div>
                ) : (
                  summary.expenseSummaries.map((expense) => (
                    <div
                      key={expense.id}
                      className="app-card-muted px-4 py-4 sm:px-5 sm:py-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="stack-sm">
                          <p className="break-words text-xl font-semibold tracking-[-0.03em] text-[var(--text)]">
                            {expense.title}
                          </p>
                          <p className="text-sm leading-6 text-[var(--text-soft)]">
                            {formatMoney(locale, expense.amountDecimal)} · {common("paidBy")}{" "}
                            {expense.paidByMember.name} · {expense.happenedOn.toISOString().slice(0, 10)}
                          </p>
                        </div>
                        <Link href={`/g/${slug}/expenses/${expense.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            <PenSquare className="mr-2 h-4 w-4" />
                            {common("edit")}
                          </Button>
                        </Link>
                      </div>

                      {expense.notes ? (
                        <p className="mt-4 rounded-[var(--radius-sm)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 break-words text-[var(--text-soft)]">
                          {expense.notes}
                        </p>
                      ) : null}

                      <div className="mt-4 stack-sm">
                        <p className="section-kicker !mb-0 !text-[12px]">
                          {common("participants")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {expense.participants.map((participant) => (
                            <span
                              key={participant.memberId}
                              className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] text-[var(--text)]"
                            >
                              {participant.member.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs leading-5 text-[var(--text-muted)]">
                          {pageT("shareSummary", { count: expense.participants.length })}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {expense.shares.map((share) => {
                          const participant = expense.participants.find(
                            (entry) => entry.memberId === share.memberId,
                          );

                          return (
                            <span
                              key={share.memberId}
                              className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] text-[var(--text-soft)]"
                            >
                              {participant?.member.name}: {formatMoney(locale, share.share)}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="workspace-secondary">
            <div className="members-section app-card p-5 sm:p-6">
              <h2 className="section-title !mb-0">{common("members")}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                {pageT("memberCount", { count: group.members.length })}
              </p>
              <div className="mt-5 stack-md">
                <div className="app-card-muted p-3">
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((member) => (
                      <span
                        key={member.id}
                        className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] text-[var(--text)]"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="utility-card p-4">
                  <form action={addMemberAction} className="stack-sm">
                    <input name="locale" type="hidden" value={locale} />
                    <input name="slug" type="hidden" value={slug} />
                    <Label htmlFor="member-name">{pageT("addMemberTitle")}</Label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="member-name"
                        maxLength={50}
                        name="name"
                        placeholder={pageT("memberNamePlaceholder")}
                        required
                      />
                      <PendingButton
                        className="sm:w-auto"
                        idleLabel={common("add")}
                        pendingLabel={pageT("saving")}
                        type="submit"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="balances-section app-card p-5 sm:p-6">
              <h2 className="section-title !mb-0">{common("balances")}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                {pageT("balancesIntro")}
              </p>
              <div className="mt-5 stack-md">
                {summary.balances.length === 0 ? (
                  <p className="utility-card border-dashed px-4 py-5 text-sm text-[var(--text-soft)]">
                    {pageT("emptyMembers")}
                  </p>
                ) : (
                  summary.balances.map((balance) => (
                    <div
                      key={balance.memberId}
                      className="utility-card flex items-center justify-between px-4 py-3"
                    >
                      <span className="font-medium text-[var(--text)]">{balance.memberName}</span>
                      <span
                        className={
                          balance.balance.isNegative()
                            ? "font-semibold text-[var(--danger)]"
                            : balance.balance.isZero()
                              ? "text-[var(--text-muted)]"
                              : "font-semibold text-[var(--success)]"
                        }
                      >
                        {formatMoney(locale, balance.balance)}
                      </span>
                    </div>
                  ))
                )}

                <div className="utility-card px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {pageT("groupSettlementSummaryTitle")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                    {pageT("groupSettlementSummaryBody")}
                  </p>
                  {summary.settlements.length === 0 ? (
                    <p className="mt-3 text-sm text-[var(--text-soft)]">
                      {pageT("settlementEmpty")}
                    </p>
                  ) : (
                    <div className="mt-3 stack-sm">
                      {summary.settlements.slice(0, 3).map((settlement) => (
                        <div
                          key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                          className="rounded-[var(--radius-sm)] bg-[var(--surface)] px-3 py-3 text-sm"
                        >
                          <p className="font-medium text-[var(--text)]">
                            {pageT("settlementLine", {
                              from: settlement.fromMemberName,
                              to: settlement.toMemberName,
                              amount: formatMoney(locale, settlement.amount),
                            })}
                          </p>
                        </div>
                      ))}
                      {summary.settlements.length > 3 ? (
                        <p className="text-xs text-[var(--text-muted)]">
                          {pageT("moreSettlementsHint", {
                            count: summary.settlements.length - 3,
                          })}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                <Link href={`/g/${slug}/settlement`}>
                  <Button className="w-full" variant="secondary">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    {common("settlements")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="workspace-utility">
            <div className="app-card p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="utility-card p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {common("shareLink")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                    {pageT("shareLinkBody")}
                  </p>
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
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {common("exportCsv")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                    {common("expenses")} · {common("balances")} · {common("settlements")}
                  </p>
                  <a
                    className="btn-secondary mt-3 w-full gap-2"
                    href={`/api/groups/${slug}/export`}
                  >
                    <FileDown className="h-4 w-4" />
                    {common("exportCsv")}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
