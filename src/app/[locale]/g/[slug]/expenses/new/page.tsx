import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { ExpenseForm } from "@/components/group/expense-form";
import { FormStatusMessage } from "@/components/form-status-message";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="min-h-screen bg-[var(--page-background)] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/g/${slug}`} className="text-sm font-medium text-[var(--muted-foreground)]">
            {common("group")}
          </Link>
          <LocaleSwitcher currentLocale={locale} href={`/g/${slug}/expenses/new`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{pageT("addExpenseTitle")}</CardTitle>
            <CardDescription>{pageT("expenseFormDescription")}</CardDescription>
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
              locale={locale}
              members={group.members}
              slug={slug}
              submitLabel={common("create")}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
