import { getTranslations } from "next-intl/server";

import { PendingButton } from "@/components/pending-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createExpenseAction, updateExpenseAction } from "@/lib/actions";
import { getCurrencyFractionDigits, type SupportedCurrency } from "@/lib/constants";
import { formatMoneyInput } from "@/lib/money";

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
  currency: SupportedCurrency;
  members: MemberOption[];
  submitLabel: string;
  defaultExpense?: DefaultExpense;
};

export async function ExpenseForm({
  locale,
  slug,
  currency,
  members,
  submitLabel,
  defaultExpense,
}: Props) {
  const common = await getTranslations("Common");
  const pageT = await getTranslations("GroupPage");
  const action = defaultExpense ? updateExpenseAction : createExpenseAction;
  const selected = new Set(defaultExpense?.participants.map((entry) => entry.memberId) ?? []);
  const fractionDigits = getCurrencyFractionDigits(currency);
  const amountPattern = fractionDigits === 0 ? "[0-9]+" : "[0-9]+([.][0-9]{1,2})?";
  const amountPlaceholder = fractionDigits === 0 ? "4800" : "48.00";
  const amountMaxLength = fractionDigits === 0 ? 9 : 12;

  return (
    <form action={action} className="space-y-6">
      <input name="locale" type="hidden" value={locale} />
      <input name="slug" type="hidden" value={slug} />
      {defaultExpense ? (
        <input name="expenseId" type="hidden" value={defaultExpense.id} />
      ) : null}

      {/* Title */}
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

      {/* Amount + Date (side by side) */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={defaultExpense ? `amount-${defaultExpense.id}` : "amount"}>
            {common("amount", { currency })}
          </Label>
          <Input
            defaultValue={
              defaultExpense
                ? formatMoneyInput(currency, defaultExpense.amountDecimal.toFixed(0))
                : undefined
            }
            id={defaultExpense ? `amount-${defaultExpense.id}` : "amount"}
            inputMode={fractionDigits === 0 ? "numeric" : "decimal"}
            maxLength={amountMaxLength}
            min="1"
            name="amount"
            pattern={amountPattern}
            placeholder={amountPlaceholder}
            required
            step={fractionDigits === 0 ? "1" : "0.01"}
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

      {/* Paid by */}
      <div className="space-y-2">
        <Label htmlFor={defaultExpense ? `paidBy-${defaultExpense.id}` : "paidByMemberId"}>
          {common("paidBy")}
        </Label>
        <select
          className="flex h-11 w-full px-4 py-2 text-sm"
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

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{common("notes")}</Label>
          <span className="text-xs text-[var(--text-muted)]" style={{ fontWeight: 400 }}>
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

      {/* Participants */}
      <fieldset className="space-y-3">
        <legend className="text-[14px] font-medium text-[var(--text)]">
          {common("participants")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {members.map((member) => {
            const checked = defaultExpense ? selected.has(member.id) : true;

            return (
              <label key={member.id} className="participant-chip">
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

      {/* Submit */}
      <div className="flex justify-center pt-2">
        <PendingButton
          idleLabel={submitLabel}
          pendingLabel={pageT("saving")}
          size="lg"
          type="submit"
          style={{
            borderRadius: 9999,
            paddingInline: 48,
            width: "auto",
            height: 48,
          }}
        />
      </div>
    </form>
  );
}
