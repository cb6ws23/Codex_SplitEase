import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ExpenseForm } from "@/components/group/expense-form";
import { FormStatusMessage } from "@/components/form-status-message";
import { PendingButton } from "@/components/pending-button";
import { deleteExpenseAction } from "@/lib/actions";
import { coerceSupportedCurrency, type AppLocale } from "@/lib/constants";
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
  const currency = coerceSupportedCurrency(group.currency);

  if (!expense) {
    notFound();
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

          {/* Edit form card */}
          <div className="workspace-card">
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
              {pageT("editExpenseTitle")}
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--text-soft)",
              }}
            >
              {pageT("expenseEditDescription")}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--brand)]">
              {common("currency")}: {currency}
            </p>

            <div className="mt-6 space-y-4">
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
                currency={currency}
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

          {/* Delete card */}
          <div className="workspace-card">
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              {pageT("deleteExpenseTitle")}
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--text-soft)",
              }}
            >
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
      </div>
    </main>
  );
}
