import { ArrowLeft } from "lucide-react";
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

          {/* Form card */}
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
              {pageT("addExpenseTitle")}
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--text-soft)",
              }}
            >
              {pageT("expenseFormDescription")}
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
                locale={locale}
                members={group.members}
                slug={slug}
                submitLabel={common("create")}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
