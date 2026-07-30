import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

import {
  allocateEqualShares,
  formatMoneyForExport,
  parseMoneyInput,
  toMinorUnitDecimal,
} from "@/lib/money";

describe("parseMoneyInput", () => {
  it("parses whole-number currencies into minor units", () => {
    expect(parseMoneyInput("1,200", "JPY").toString()).toBe("1200");
  });

  it("rejects fractional input for whole-number currencies", () => {
    expect(() => parseMoneyInput("1200.50", "JPY")).toThrow(
      "Amount must be a whole-number value for this currency.",
    );
  });

  it("parses decimal currencies into minor units", () => {
    expect(parseMoneyInput("12.34", "USD").toString()).toBe("1234");
    expect(parseMoneyInput("12.3", "USD").toString()).toBe("1230");
  });

  it("rejects excess precision and non-positive amounts", () => {
    expect(() => parseMoneyInput("12.345", "USD")).toThrow();
    expect(() => parseMoneyInput("0", "USD")).toThrow();
    expect(() => parseMoneyInput("-1", "USD")).toThrow();
  });
});

describe("minor-unit helpers", () => {
  it("accepts positive integers and rejects invalid minor-unit values", () => {
    expect(toMinorUnitDecimal("42").toString()).toBe("42");
    expect(() => toMinorUnitDecimal(new Decimal("1.5"))).toThrow();
    expect(() => toMinorUnitDecimal(0)).toThrow();
  });

  it("formats exports without losing currency precision", () => {
    expect(formatMoneyForExport("JPY", 1200)).toBe("1200");
    expect(formatMoneyForExport("USD", 1234)).toBe("12.34");
  });
});

describe("allocateEqualShares", () => {
  it("allocates exact equal shares", () => {
    const shares = allocateEqualShares(900, ["a", "b", "c"]);

    expect(shares.map(({ memberId, share }) => [memberId, share.toString()])).toEqual([
      ["a", "300"],
      ["b", "300"],
      ["c", "300"],
    ]);
  });

  it("distributes indivisible minor units deterministically and preserves the total", () => {
    const shares = allocateEqualShares(100, ["a", "b", "c"]);

    expect(shares.map(({ share }) => share.toString())).toEqual(["34", "33", "33"]);
    expect(
      shares.reduce((sum, { share }) => sum.plus(share), new Decimal(0)).toString(),
    ).toBe("100");
  });

  it("requires at least one participant", () => {
    expect(() => allocateEqualShares(100, [])).toThrow(
      "At least one participant is required.",
    );
  });
});
