import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  FileDown,
  Inbox,
  PenSquare,
  Plus,
} from "lucide-react";
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
    <main className="min-h-screen bg-[var(--bg)]">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="page-shell">
        <div className="workspace-layout">
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

          {/* ── Group Header ── */}
          <div className="workspace-card">
            <h1
              className="break-words capitalize"
              style={{
                fontSize: 26,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                color: "var(--text)",
                margin: 0,
              }}
            >
              {group.name}
            </h1>
            <p
              className="mt-1.5"
              style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-soft)" }}
            >
              {pageT("memberCount", { count: group.members.length })} ·{" "}
              {pageT("expenseCount", { count: group.expenses.length })}
              {!summary.totalExpenseAmount.equals(0) && (
                <> · {formatMoney(locale, summary.totalExpenseAmount)}</>
              )}
            </p>

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
          </div>

          {/* ── Expenses Section ── */}
          <section className="workspace-primary">
            <div className="workspace-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="section-title" style={{ margin: 0 }}>
                  {common("expenses")}
                </h2>
                {group.members.length > 0 ? (
                  <Link href={`/g/${slug}/expenses/new`}>
                    <Button
                      className="w-full sm:w-auto"
                      style={{
                        borderRadius: 9999,
                        height: 38,
                        fontSize: 14,
                        paddingInline: 20,
                      }}
                    >
                      <Plus className="mr-1.5 h-4 w-4" />
                      {pageT("addExpenseTitle")}
                    </Button>
                  </Link>
                ) : null}
              </div>

              <div className="mt-5">
                {summary.expenseSummaries.length === 0 ? (
                  <div className="empty-state">
                    <Inbox
                      className="text-[var(--text-muted)]"
                      style={{ width: 32, height: 32 }}
                    />
                    <p className="empty-state-title">
                      {pageT("emptyExpensesTitle")}
                    </p>
                    <p className="empty-state-text">
                      {group.members.length === 0
                        ? pageT("emptyExpensesNoMembersBody")
                        : pageT("emptyExpensesReadyBody")}
                    </p>
                  </div>
                ) : (
                  <div className="stack-md">
                    {summary.expenseSummaries.map((expense) => (
                      <div
                        key={expense.id}
                        className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 sm:px-5 sm:py-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="stack-sm">
                            <p className="break-words text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">
                              {expense.title}
                            </p>
                            <p className="text-sm leading-6 text-[var(--text-soft)]">
                              {formatMoney(locale, expense.amountDecimal)} ·{" "}
                              {common("paidBy")} {expense.paidByMember.name} ·{" "}
                              {expense.happenedOn.toISOString().slice(0, 10)}
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
                          <p className="mt-4 rounded-[8px] bg-[var(--surface)] px-4 py-3 text-sm leading-6 break-words text-[var(--text-soft)]">
                            {expense.notes}
                          </p>
                        ) : null}

                        <div className="mt-4 stack-sm">
                          <p
                            className="section-kicker"
                            style={{ margin: 0, fontSize: 12 }}
                          >
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
                            {pageT("shareSummary", {
                              count: expense.participants.length,
                            })}
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
                                {participant?.member.name}:{" "}
                                {formatMoney(locale, share.share)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Members + Balances (side-by-side) ── */}
          <section className="workspace-secondary">
            {/* Members */}
            <div className="workspace-card">
              <h2 className="section-title" style={{ margin: 0 }}>
                {common("members")}
              </h2>
              <p className="section-subtitle mt-1.5">
                {pageT("memberCount", { count: group.members.length })}
              </p>

              {group.members.length > 0 && (
                <div className="member-chips mt-4">
                  {group.members.map((member) => (
                    <span key={member.id} className="member-chip">
                      {member.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5">
                <form action={addMemberAction} className="stack-sm">
                  <input name="locale" type="hidden" value={locale} />
                  <input name="slug" type="hidden" value={slug} />
                  <Label htmlFor="member-name" className="text-[13px] font-medium text-[var(--text-soft)]">
                    {pageT("addMemberTitle")}
                  </Label>
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
                      variant="outline"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Balances */}
            <div className="workspace-card">
              <h2 className="section-title" style={{ margin: 0 }}>
                {common("balances")}
              </h2>
              <p className="section-subtitle mt-1.5">
                {pageT("balancesIntro")}
              </p>

              <div className="mt-4">
                {summary.balances.length === 0 ? (
                  <p
                    className="text-sm text-[var(--text-muted)]"
                    style={{
                      padding: "16px 0",
                      borderTop: "1px solid rgba(10,37,64,0.06)",
                    }}
                  >
                    {pageT("emptyMembers")}
                  </p>
                ) : (
                  <div>
                    {summary.balances.map((balance) => (
                      <div key={balance.memberId} className="balance-row">
                        <span className="text-sm font-medium text-[var(--text)]">
                          {balance.memberName}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            balance.balance.isNegative()
                              ? "text-[var(--danger)]"
                              : balance.balance.isZero()
                                ? "text-[var(--text-muted)]"
                                : "text-[var(--success)]"
                          }`}
                        >
                          {formatMoney(locale, balance.balance)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settlement snapshot */}
              <div
                className="mt-4 rounded-[10px] bg-[var(--surface-muted)] px-4 py-4"
                style={{ border: "1px solid rgba(10,37,64,0.06)" }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {pageT("groupSettlementSummaryTitle")}
                </p>
                <p className="section-subtitle mt-1">
                  {pageT("groupSettlementSummaryBody")}
                </p>
                {summary.settlements.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    {pageT("settlementEmpty")}
                  </p>
                ) : (
                  <div className="mt-3 stack-sm">
                    {summary.settlements.slice(0, 3).map((settlement) => (
                      <div
                        key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                        className="rounded-[8px] bg-[var(--surface)] px-3 py-3 text-sm"
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

              <div className="mt-4">
                <Link href={`/g/${slug}/settlement`}>
                  <Button className="w-full" variant="outline">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    {common("settlements")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ── Share + Export ── */}
          <section className="workspace-utility">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Share link */}
              <div className="workspace-card">
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {common("shareLink")}
                </p>
                <p className="section-subtitle mt-1">
                  {pageT("shareLinkBody")}
                </p>
                <div className="mt-3">
                  <ShareLinkButton
                    copiedLabel={common("copied")}
                    copyLabel={common("copy")}
                    inline
                    url={groupUrl}
                  />
                </div>
              </div>

              {/* Export CSV */}
              <div className="workspace-card">
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {common("exportCsv")}
                </p>
                <p className="section-subtitle mt-1">
                  {common("expenses")} · {common("balances")} ·{" "}
                  {common("settlements")}
                </p>
                <a
                  className="btn-outline-link mt-3 w-full"
                  href={`/api/groups/${slug}/export`}
                >
                  <FileDown className="h-4 w-4" />
                  {common("exportCsv")}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
