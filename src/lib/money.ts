import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_DOWN });

export function toMoneyDecimal(value: Decimal.Value) {
  const decimal = new Decimal(value);

  if (!decimal.isInteger() || !decimal.isPositive()) {
    throw new Error("Money values must be positive integers for JPY.");
  }

  return decimal;
}

export function parseYenInput(value: string) {
  const normalized = value.replace(/[,\s]/g, "");

  if (!/^\d+$/.test(normalized)) {
    throw new Error("Amount must be a whole-number JPY value.");
  }

  return toMoneyDecimal(normalized);
}

export function formatMoney(
  locale: string,
  value: Decimal.Value | null | undefined,
) {
  const decimal = value == null ? new Decimal(0) : new Decimal(value);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(decimal.toNumber());
}

export function allocateEqualShares(
  total: Decimal.Value,
  participantIds: string[],
) {
  const amount = toMoneyDecimal(total);

  if (participantIds.length === 0) {
    throw new Error("At least one participant is required.");
  }

  const divisor = new Decimal(participantIds.length);
  const baseShare = amount.dividedToIntegerBy(divisor);
  const remainder = amount.mod(divisor).toNumber();

  return participantIds.map((memberId, index) => ({
    memberId,
    share: baseShare.plus(index < remainder ? 1 : 0),
  }));
}

export function decimalAbs(value: Decimal.Value) {
  return new Decimal(value).abs();
}

export function decimalMin(left: Decimal.Value, right: Decimal.Value) {
  return Decimal.min(new Decimal(left), new Decimal(right));
}
