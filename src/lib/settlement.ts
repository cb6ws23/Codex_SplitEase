import Decimal from "decimal.js";

import { decimalAbs, decimalMin } from "@/lib/money";

export type SettlementInput = {
  memberId: string;
  memberName: string;
  balance: Decimal;
};

export type SettlementRecommendation = {
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  amount: Decimal;
};

export function buildSettlementRecommendations(balances: SettlementInput[]) {
  const total = balances.reduce(
    (sum, entry) => sum.plus(entry.balance),
    new Decimal(0),
  );

  if (!total.isZero()) {
    throw new Error("Settlement balances must net to zero.");
  }

  const debtors = balances
    .filter((entry) => entry.balance.isNegative())
    .map((entry) => ({
      ...entry,
      remaining: decimalAbs(entry.balance),
    }))
    .sort((left, right) => right.remaining.comparedTo(left.remaining));

  const creditors = balances
    .filter((entry) => entry.balance.isPositive())
    .map((entry) => ({
      ...entry,
      remaining: new Decimal(entry.balance),
    }))
    .sort((left, right) => right.remaining.comparedTo(left.remaining));

  const recommendations: SettlementRecommendation[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = decimalMin(debtor.remaining, creditor.remaining);

    if (amount.greaterThan(0)) {
      recommendations.push({
        fromMemberId: debtor.memberId,
        fromMemberName: debtor.memberName,
        toMemberId: creditor.memberId,
        toMemberName: creditor.memberName,
        amount,
      });
    }

    debtor.remaining = debtor.remaining.minus(amount);
    creditor.remaining = creditor.remaining.minus(amount);

    if (debtor.remaining.isZero()) {
      debtorIndex += 1;
    }

    if (creditor.remaining.isZero()) {
      creditorIndex += 1;
    }
  }

  const unresolvedDebtor = debtors.some((entry) => !entry.remaining.isZero());
  const unresolvedCreditor = creditors.some((entry) => !entry.remaining.isZero());

  if (unresolvedDebtor || unresolvedCreditor) {
    throw new Error("Settlement matching left unresolved balances.");
  }

  return recommendations;
}
