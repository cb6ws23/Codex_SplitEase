import { getTranslations } from "next-intl/server";

import { PendingButton } from "@/components/pending-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createExpenseAction, updateExpenseAction } from "@/lib/actions";

type MemberOption = {
  id: string;
  name: string;
};

type DefaultExpense = {
  id: string;
  title: string;
  notes: string | null;
  amountDecimal: { toFixed(scale?: number): string };
  paidByMemberId: string;
  happenedOn: Date;
  participants: Array<{
    memberId: string;
  }>;
};

type Props = {
  locale: string;
  slug: string;
  members: MemberOption[];
  submitLabel: string;
  defaultExpense?: DefaultExpense;
};

export async function ExpenseForm({
  locale,
  slug,
  members,
  submitLabel,
  defaultExpense,
}: Props) {
  const common = await getTranslations("Common");
  const pageT = await getTranslations("GroupPage");
  const action = defaultExpense ? updateExpenseAction : createExpenseAction;
  const selected = new Set(defaultExpense?.participants.map((entry) => entry.memberId) ?? []);

  return (
    <form action={action} className="space-y-4">
      <input name="locale" type="hidden" value={locale} />
      <input name="slug" type="hidden" value={slug} />
      {defaultExpense ? (
        <input name="expenseId" type="hidden" value={defaultExpense.id} />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor={defaultExpense ? `title-${defaultExpense.id}` : "title"}>
          {common("title")}
        </Label>
        <Input
          defaultValue={defaultExpense?.title}
          id={defaultExpense ? `title-${defaultExpense.id}` : "title"}
          maxLength={100}
          name="title"
          placeholder={pageT("expenseTitlePlaceholder")}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={defaultExpense ? `amount-${defaultExpense.id}` : "amount"}>
            {common("amount")}
          </Label>
          <Input
            defaultValue={defaultExpense?.amountDecimal.toFixed(0)}
            id={defaultExpense ? `amount-${defaultExpense.id}` : "amount"}
            inputMode="numeric"
            maxLength={9}
            min="1"
            name="amount"
            pattern="[0-9]+"
            placeholder="4800"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={defaultExpense ? `happenedOn-${defaultExpense.id}` : "happenedOn"}>
            {common("date")}
          </Label>
          <Input
            defaultValue={
              defaultExpense?.happenedOn.toISOString().slice(0, 10) ??
              new Date().toISOString().slice(0, 10)
            }
            id={defaultExpense ? `happenedOn-${defaultExpense.id}` : "happenedOn"}
            name="happenedOn"
            type="date"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={defaultExpense ? `paidBy-${defaultExpense.id}` : "paidByMemberId"}>
          {common("paidBy")}
        </Label>
        <select
          className="flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--ring)_20%,transparent)]"
          defaultValue={defaultExpense?.paidByMemberId ?? members[0]?.id}
          id={defaultExpense ? `paidBy-${defaultExpense.id}` : "paidByMemberId"}
          name="paidByMemberId"
          required
        >
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{common("notes")}</Label>
          <span className="text-xs text-[var(--muted-foreground)]">
            {common("optional")}
          </span>
        </div>
        <Textarea
          defaultValue={defaultExpense?.notes ?? ""}
          maxLength={400}
          name="notes"
          placeholder={pageT("expenseNotesPlaceholder")}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">{common("participants")}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {members.map((member) => {
            const checked = defaultExpense ? selected.has(member.id) : true;

            return (
              <label
                key={member.id}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm"
              >
                <input
                  defaultChecked={checked}
                  name="participantIds"
                  type="checkbox"
                  value={member.id}
                />
                <span>{member.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <PendingButton
        className="w-full"
        idleLabel={submitLabel}
        pendingLabel={pageT("saving")}
        size="lg"
        type="submit"
      />
    </form>
  );
}
