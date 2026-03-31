import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowRightLeft, FileDown, PenSquare, Plus } from "lucide-react";
import Decimal from "decimal.js";

import { FormStatusMessage } from "@/components/form-status-message";
import { RecentGroupTracker } from "@/components/group/recent-group-tracker";
import { PendingButton } from "@/components/pending-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ShareLinkButton } from "@/components/group/share-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMemberAction, verifyAccessOrNull } from "@/lib/actions";
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
    case "invalidAccess":
      return feedback("invalidAccess");
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

  if (status === "invalidAccess" || status === "invalidMember" || status === "error") {
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
  const [group, hasWriteAccess, common, pageT, feedback] = await Promise.all([
    getGroupBySlug(slug),
    verifyAccessOrNull(slug),
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
  const publicUrl = `${appUrl}/${locale}/g/${group.slug}`;
  const writeUrl = hasWriteAccess
    ? `${appUrl}/api/groups/${group.slug}/access?token=${encodeURIComponent(hasWriteAccess)}&locale=${locale}`
    : publicUrl;

  return (
    <main className="min-h-screen bg-[var(--page-background)] px-3 py-4 sm:px-4 sm:py-6">
      <RecentGroupTracker locale={locale} name={group.name} slug={group.slug} />
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-[var(--muted-foreground)]">
            {common("backHome")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/g/${slug}`} />
        </div>

        <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,248,238,0.96))]">
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-3">
                <Badge className="w-fit">{common("currency")}</Badge>
                <CardTitle className="break-words text-2xl sm:text-3xl">{group.name}</CardTitle>
                <CardDescription className="max-w-2xl">
                  {pageT("memberCount", { count: group.members.length })} ·{" "}
                  {pageT("expenseCount", { count: group.expenses.length })}
                </CardDescription>
              </div>
              <a
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]"
                href={`/api/groups/${slug}/export`}
              >
                <FileDown className="h-4 w-4" />
                {common("exportCsv")}
              </a>
            </div>

            {notice ? <FormStatusMessage message={notice} tone={statusTone(status)} /> : null}
            {hasSummaryError ? (
              <FormStatusMessage message={feedback("error")} tone="error" />
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-white/85 p-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">{common("shareLink")}</p>
                  <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                    {pageT("publicViewHint")}
                  </p>
                </div>
                <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-xs break-all text-[var(--muted-foreground)]">
                  {publicUrl}
                </div>
                <div className="mt-3">
                  <ShareLinkButton
                    copiedLabel={common("copied")}
                    copyLabel={common("copy")}
                    url={publicUrl}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-white/85 p-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">{pageT("writeAccessTitle")}</p>
                  <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                    {hasWriteAccess ? pageT("writeAccessReady") : pageT("writeAccessBody")}
                  </p>
                </div>
                <div className="mt-3 rounded-2xl bg-[var(--muted)] px-4 py-3 text-xs leading-5 text-[var(--muted-foreground)]">
                  <p>{pageT("writeAccessStepOne")}</p>
                  <p>{pageT("writeAccessStepTwo")}</p>
                  <p>{pageT("writeAccessStepThree")}</p>
                </div>
                {hasWriteAccess ? (
                  <>
                    <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-xs break-all text-[var(--muted-foreground)]">
                      {writeUrl}
                    </div>
                    <div className="mt-3">
                      <ShareLinkButton
                        copiedLabel={common("copied")}
                        copyLabel={pageT("copyWriteLink")}
                        url={writeUrl}
                      />
                    </div>
                  </>
                ) : (
                  <form action={`/api/groups/${slug}/access`} className="mt-3 space-y-3">
                    <input type="hidden" name="locale" value={locale} />
                    <Input
                      autoCapitalize="off"
                      autoCorrect="off"
                      maxLength={64}
                      name="token"
                      placeholder={pageT("accessPlaceholder")}
                      required
                    />
                    <PendingButton
                      className="w-full"
                      idleLabel={pageT("accessSubmit")}
                      pendingLabel={pageT("unlocking")}
                      size="lg"
                      type="submit"
                    />
                  </form>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <CardTitle>{common("members")}</CardTitle>
              <CardDescription>
                {pageT("memberCount", { count: group.members.length })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {group.members.map((member) => (
                  <Badge key={member.id} className="bg-[var(--muted)]">
                    {member.name}
                  </Badge>
                ))}
              </div>

              {hasWriteAccess ? (
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
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                  {pageT("unlockMembersHint")}
                </div>
              )}
            </CardContent>
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
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {pageT("groupSettlementSummaryTitle")}
                  </p>
                  <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                    {pageT("groupSettlementSummaryBody")}
                  </p>
                </div>
                {summary.settlements.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                    {pageT("settlementEmpty")}
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {summary.settlements.slice(0, 3).map((settlement) => (
                      <div
                        key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
                        className="rounded-2xl bg-white px-3 py-3 text-sm"
                      >
                        <p className="font-medium">
                          {pageT("settlementLine", {
                            from: settlement.fromMemberName,
                            to: settlement.toMemberName,
                            amount: formatMoney(locale, settlement.amount),
                          })}
                        </p>
                      </div>
                    ))}
                    {summary.settlements.length > 3 ? (
                      <p className="text-xs text-[var(--muted-foreground)]">
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
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="space-y-2">
              <CardTitle>{common("expenses")}</CardTitle>
              <CardDescription>
                {summary.totalExpenseAmount.equals(0)
                  ? pageT("emptyExpenses")
                  : formatMoney(locale, summary.totalExpenseAmount)}
              </CardDescription>
            </div>
            {hasWriteAccess && group.members.length > 0 ? (
              <Link href={`/g/${slug}/expenses/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {pageT("addExpenseTitle")}
                </Button>
              </Link>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.expenseSummaries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--muted)]/45 px-4 py-5 text-sm text-[var(--muted-foreground)]">
                <p className="font-medium text-[var(--foreground)]">
                  {pageT("emptyExpensesTitle")}
                </p>
                <p className="mt-2 leading-6 break-words">
                  {group.members.length === 0
                    ? pageT("emptyExpensesNoMembersBody")
                    : hasWriteAccess
                      ? pageT("emptyExpensesReadyBody")
                      : pageT("emptyExpensesLockedBody")}
                </p>
                <div className="mt-4 space-y-2 rounded-2xl bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {pageT("emptyExpensesNextTitle")}
                  </p>
                  <p className="text-sm text-[var(--foreground)]">
                    {group.members.length === 0
                      ? pageT("addMemberFirstHint")
                      : hasWriteAccess
                        ? pageT("emptyExpensesReadyAction")
                        : pageT("unlockExpenseHint")}
                  </p>
                </div>
              </div>
            ) : (
              summary.expenseSummaries.map((expense) => (
                <Card key={expense.id} className="bg-white">
                  <CardHeader className="gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="break-words text-lg">{expense.title}</CardTitle>
                        <CardDescription>
                          {formatMoney(locale, expense.amountDecimal)} · {common("paidBy")}{" "}
                          {expense.paidByMember.name} · {expense.happenedOn.toISOString().slice(0, 10)}
                        </CardDescription>
                      </div>
                      {hasWriteAccess ? (
                        <Link href={`/g/${slug}/expenses/${expense.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            <PenSquare className="mr-2 h-4 w-4" />
                            {common("edit")}
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                    {expense.notes ? (
                      <p className="rounded-2xl bg-[var(--muted)] px-4 py-3 text-sm break-words text-[var(--muted-foreground)]">
                        {expense.notes}
                      </p>
                    ) : null}
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        {common("participants")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {expense.participants.map((participant) => (
                          <Badge key={participant.memberId} className="bg-[var(--muted)]">
                            {participant.member.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                        {pageT("shareSummary", { count: expense.participants.length })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {expense.shares.map((share) => {
                        const participant = expense.participants.find(
                          (entry) => entry.memberId === share.memberId,
                        );

                        return (
                          <Badge key={share.memberId} className="bg-[var(--muted)]">
                            {participant?.member.name}: {formatMoney(locale, share.share)}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
