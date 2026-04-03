import Decimal from "decimal.js";

import { getCurrencyFractionDigits, type SupportedCurrency } from "@/lib/constants";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_DOWN });

export function toMinorUnitDecimal(value: Decimal.Value) {
  const decimal = new Decimal(value);

  if (!decimal.isInteger() || !decimal.isPositive()) {
    throw new Error("Money values must be positive integers in minor units.");
  }

  return decimal;
}

export function parseMoneyInput(value: string, currency: SupportedCurrency) {
  const normalized = value.replace(/[,\s]/g, "");
  const fractionDigits = getCurrencyFractionDigits(currency);

  if (fractionDigits === 0) {
    if (!/^\d+$/.test(normalized)) {
      throw new Error("Amount must be a whole-number value for this currency.");
    }

    return toMinorUnitDecimal(normalized);
  }

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error("Amount must be a valid decimal value for this currency.");
  }

  const decimal = new Decimal(normalized);
  const scaled = decimal.mul(new Decimal(10).pow(fractionDigits));

  if (!scaled.isInteger() || !scaled.isPositive()) {
    throw new Error("Amount must be a valid minor-unit value for this currency.");
  }

  return toMinorUnitDecimal(scaled);
}

export function formatMoney(
  locale: string,
  currency: SupportedCurrency,
  value: Decimal.Value | null | undefined,
) {
  const decimal = value == null ? new Decimal(0) : new Decimal(value);
  const fractionDigits = getCurrencyFractionDigits(currency);
  const amount = fractionDigits === 0
    ? decimal
    : decimal.div(new Decimal(10).pow(fractionDigits));

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount.toNumber());
}

export function formatMoneyInput(
  currency: SupportedCurrency,
  value: Decimal.Value | null | undefined,
) {
  const decimal = value == null ? new Decimal(0) : new Decimal(value);
  const fractionDigits = getCurrencyFractionDigits(currency);

  if (fractionDigits === 0) {
    return decimal.toFixed(0);
  }

  return decimal.div(new Decimal(10).pow(fractionDigits)).toFixed(fractionDigits);
}

export function formatMoneyForExport(
  currency: SupportedCurrency,
  value: Decimal.Value | null | undefined,
) {
  const decimal = value == null ? new Decimal(0) : new Decimal(value);
  const fractionDigits = getCurrencyFractionDigits(currency);

  if (fractionDigits === 0) {
    return decimal.toFixed(0);
  }

  return decimal.div(new Decimal(10).pow(fractionDigits)).toFixed(fractionDigits);
}

export function allocateEqualShares(
  total: Decimal.Value,
  participantIds: string[],
) {
  const amount = toMinorUnitDecimal(total);

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
