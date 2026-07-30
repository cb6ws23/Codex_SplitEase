import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

import {
  buildSettlementRecommendations,
  type SettlementInput,
} from "@/lib/settlement";

function balance(
  memberId: string,
  memberName: string,
  amount: Decimal.Value,
): SettlementInput {
  return {
    memberId,
    memberName,
    balance: new Decimal(amount),
  };
}

describe("buildSettlementRecommendations", () => {
  it("matches one debtor with one creditor", () => {
    const recommendations = buildSettlementRecommendations([
      balance("a", "A", -500),
      balance("b", "B", 500),
    ]);

    expect(
      recommendations.map((entry) => ({
        from: entry.fromMemberId,
        to: entry.toMemberId,
        amount: entry.amount.toString(),
      })),
    ).toEqual([{ from: "a", to: "b", amount: "500" }]);
  });

  it("matches multiple debtors and creditors deterministically", () => {
    const recommendations = buildSettlementRecommendations([
      balance("a", "A", -700),
      balance("b", "B", -300),
      balance("c", "C", 500),
      balance("d", "D", 500),
    ]);

    expect(
      recommendations.map((entry) => [
        entry.fromMemberId,
        entry.toMemberId,
        entry.amount.toString(),
      ]),
    ).toEqual([
      ["a", "c", "500"],
      ["a", "d", "200"],
      ["b", "d", "300"],
    ]);
  });

  it("returns no transfers when every balance is zero", () => {
    expect(
      buildSettlementRecommendations([
        balance("a", "A", 0),
        balance("b", "B", 0),
      ]),
    ).toEqual([]);
  });

  it("rejects balances that do not net to zero", () => {
    expect(() =>
      buildSettlementRecommendations([
        balance("a", "A", -100),
        balance("b", "B", 90),
      ]),
    ).toThrow("Settlement balances must net to zero.");
  });

  it("produces transfers that fully resolve every starting balance", () => {
    const inputs = [
      balance("a", "A", -650),
      balance("b", "B", -350),
      balance("c", "C", 600),
      balance("d", "D", 400),
    ];
    const recommendations = buildSettlementRecommendations(inputs);
    const resolved = new Map(
      inputs.map((entry) => [entry.memberId, new Decimal(entry.balance)]),
    );

    for (const transfer of recommendations) {
      resolved.set(
        transfer.fromMemberId,
        resolved.get(transfer.fromMemberId)!.plus(transfer.amount),
      );
      resolved.set(
        transfer.toMemberId,
        resolved.get(transfer.toMemberId)!.minus(transfer.amount),
      );
    }

    expect([...resolved.values()].every((value) => value.isZero())).toBe(true);
  });
});
