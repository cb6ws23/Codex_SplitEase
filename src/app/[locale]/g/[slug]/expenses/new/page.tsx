import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { ExpenseForm } from "@/components/group/expense-form";
import { FormStatusMessage } from "@/components/form-status-message";
import { type AppLocale } from "@/lib/constants";
import { getGroupBySlug } from "@/lib/groups";
import { Link } from "@/i18n/navigation";

export default async function NewExpensePage({
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

  if (group.members.length === 0) {
    redirect(`/${locale}/g/${slug}?status=invalidExpense`);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-page)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="page-topbar">
          <Link href={`/g/${slug}`} className="page-back-link">
            {common("group")}
          </Link>
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {pageT("addExpenseTitle")}
          </h1>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {pageT("expenseFormDescription")}
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
              locale={locale}
              members={group.members}
              slug={slug}
              submitLabel={common("create")}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
