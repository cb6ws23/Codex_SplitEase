import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { ExpenseForm } from "@/components/group/expense-form";
import { FormStatusMessage } from "@/components/form-status-message";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PendingButton } from "@/components/pending-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteExpenseAction, verifyAccessOrNull } from "@/lib/actions";
import { type AppLocale } from "@/lib/constants";
import { getGroupBySlug } from "@/lib/groups";
import { Link } from "@/i18n/navigation";

export default async function EditExpensePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale; slug: string; expenseId: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ locale, slug, expenseId }, { status }] = await Promise.all([
    params,
    searchParams,
  ]);
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

  if (!hasWriteAccess) {
    redirect(`/${locale}/g/${slug}?status=invalidAccess`);
  }

  const expense = group.expenses.find((entry) => entry.id === expenseId);

  if (!expense) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--page-background)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${slug}`} className="text-sm font-medium text-[var(--muted-foreground)]">
            {common("group")}
          </Link>
          <LocaleSwitcher
            currentLocale={locale}
            href={`/g/${slug}/expenses/${expenseId}/edit`}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{pageT("editExpenseTitle")}</CardTitle>
            <CardDescription>{pageT("writeAccessReady")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "invalidExpense" ? (
              <FormStatusMessage message={feedback("invalidExpense")} tone="error" />
            ) : null}
            {status === "invalidAmount" ? (
              <FormStatusMessage message={feedback("invalidAmount")} tone="error" />
            ) : null}
            {status === "error" ? (
              <FormStatusMessage message={feedback("error")} tone="error" />
            ) : null}
            <ExpenseForm
              defaultExpense={{
                ...expense,
                amountDecimal: { toFixed: () => expense.amount.toString() },
              }}
              locale={locale}
              members={group.members}
              slug={slug}
              submitLabel={common("save")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{pageT("deleteExpenseTitle")}</CardTitle>
            <CardDescription>{pageT("deleteExpenseHint")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={deleteExpenseAction}>
              <input name="locale" type="hidden" value={locale} />
              <input name="slug" type="hidden" value={slug} />
              <input name="expenseId" type="hidden" value={expense.id} />
              <PendingButton
                idleLabel={common("delete")}
                pendingLabel={feedback("deleting")}
                type="submit"
                variant="destructive"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
