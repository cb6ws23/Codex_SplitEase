import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ExpenseForm } from "@/components/group/expense-form";
import { FormStatusMessage } from "@/components/form-status-message";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { PendingButton } from "@/components/pending-button";
import { deleteExpenseAction } from "@/lib/actions";
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
  const [group, common, pageT, feedback] = await Promise.all([
    getGroupBySlug(slug),
    getTranslations("Common"),
    getTranslations("GroupPage"),
    getTranslations("Feedback"),
  ]);

  if (!group) {
    notFound();
  }

  const expense = group.expenses.find((entry) => entry.id === expenseId);

  if (!expense) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bg-page)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-lg space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${slug}`} className="text-sm font-medium text-[var(--text-secondary)]">
            {common("group")}
          </Link>
          <LocaleSwitcher
            currentLocale={locale}
            href={`/g/${slug}/expenses/${expenseId}/edit`}
          />
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {pageT("editExpenseTitle")}
          </h1>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("expenseEditDescription")}
          </p>
          <div className="mt-5 space-y-4">
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
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {pageT("deleteExpenseTitle")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("deleteExpenseHint")}
          </p>
          <div className="mt-4">
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
          </div>
        </div>
      </div>
    </main>
  );
}
