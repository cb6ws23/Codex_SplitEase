import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowRightLeft, FileDown, PenSquare, Plus } from "lucide-react";
import Decimal from "decimal.js";

import { FormStatusMessage } from "@/components/form-status-message";
import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { PendingButton } from "@/components/pending-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
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
    <main className="min-h-screen bg-[var(--bg-page)] px-3 py-4 sm:px-4 sm:py-6">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-[var(--text-secondary)]">
            {common("backHome")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/g/${slug}`} />
        </div>

        {/* Group header card */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h1 className="break-words text-2xl font-semibold text-[var(--text-primary)]">
                {group.name}
              </h1>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {pageT("memberCount", { count: group.members.length })} ·{" "}
                {pageT("expenseCount", { count: group.expenses.length })}
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)]"
              href={`/api/groups/${slug}/export`}
            >
              <FileDown className="h-4 w-4" />
              {common("exportCsv")}
            </a>
          </div>

          {notice ? (
            <div className="mt-4">
              <FormStatusMessage message={notice} tone={statusTone(status)} />
            </div>
          ) : null}
          {hasSummaryError ? (
            <div className="mt-4">
              <FormStatusMessage message={feedback("error")} tone="error" />
            </div>
          ) : null}

          {/* Share link */}
          <div className="mt-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {common("shareLink")}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {pageT("shareLinkBody")}
            </p>
            <div className="mt-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card-hover)] px-4 py-3 text-xs break-all text-[var(--text-secondary)]">
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
        </div>

        {/* Members + Balances side-by-side */}
        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Members */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {common("members")}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {pageT("memberCount", { count: group.members.length })}
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-3">
                {group.members.map((member) => (
                  <span
                    key={member.id}
                    className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-1 text-[13px] text-[var(--text-primary)]"
                  >
                    {member.name}
                  </span>
                ))}
              </div>

              <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4">
                <form action={addMemberAction} className="space-y-3">
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

              {/* Settlement snapshot */}
              <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card-hover)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {pageT("groupSettlementSummaryTitle")}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  {pageT("groupSettlementSummaryBody")}
                </p>
                {summary.settlements.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    {pageT("settlementEmpty")}
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {summary.settlements.slice(0, 3).map((settlement) => (
                      <div
                        key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                        className="rounded-lg bg-[var(--bg-page)] px-3 py-3 text-sm"
                      >
                        <p className="font-medium text-[var(--text-primary)]">
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

        {/* Expenses */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {common("expenses")}
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
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

          <div className="mt-5 space-y-4">
            {summary.expenseSummaries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-5 text-sm text-[var(--text-secondary)]">
                <p className="font-medium text-[var(--text-primary)]">
                  {pageT("emptyExpensesTitle")}
                </p>
                <p className="mt-2 leading-6 break-words">
                  {group.members.length === 0
                    ? pageT("emptyExpensesNoMembersBody")
                    : pageT("emptyExpensesReadyBody")}
                </p>
                <div className="mt-4 rounded-lg bg-[var(--bg-card-hover)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {pageT("emptyExpensesNextTitle")}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">
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
                  className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="break-words text-lg font-semibold text-[var(--text-primary)]">
                        {expense.title}
                      </p>
                      <p className="text-sm leading-6 text-[var(--text-secondary)]">
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
                    <p className="mt-3 rounded-lg bg-[var(--bg-card-hover)] px-4 py-3 text-sm break-words text-[var(--text-secondary)]">
                      {expense.notes}
                    </p>
                  ) : null}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {common("participants")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {expense.participants.map((participant) => (
                        <span
                          key={participant.memberId}
                          className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-1 text-[13px] text-[var(--text-primary)]"
                        >
                          {participant.member.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs leading-5 text-[var(--text-muted)]">
                      {pageT("shareSummary", { count: expense.participants.length })}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expense.shares.map((share) => {
                      const participant = expense.participants.find(
                        (entry) => entry.memberId === share.memberId,
                      );

                      return (
                        <span
                          key={share.memberId}
                          className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-card-hover)] px-3 py-1 text-[13px] text-[var(--text-secondary)]"
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
      </div>
    </main>
  );
}
