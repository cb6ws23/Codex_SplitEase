export const APP_NAME = "Splita";
export const DEFAULT_CURRENCY = "JPY";
export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "ja", "zh-CN"] as const;
export const SUPPORTED_CURRENCIES = [
  "JPY",
  "USD",
  "EUR",
  "GBP",
  "CNY",
  "KRW",
] as const;

export type AppLocale = (typeof LOCALES)[number];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_METADATA: Record<
  SupportedCurrency,
  {
    code: SupportedCurrency;
    fractionDigits: number;
  }
> = {
  JPY: { code: "JPY", fractionDigits: 0 },
  USD: { code: "USD", fractionDigits: 2 },
  EUR: { code: "EUR", fractionDigits: 2 },
  GBP: { code: "GBP", fractionDigits: 2 },
  CNY: { code: "CNY", fractionDigits: 2 },
  KRW: { code: "KRW", fractionDigits: 0 },
};

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return value in CURRENCY_METADATA;
}

export function coerceSupportedCurrency(value: string | null | undefined): SupportedCurrency {
  if (value && isSupportedCurrency(value)) {
    return value;
  }

  return DEFAULT_CURRENCY;
}

export function getCurrencyFractionDigits(currency: SupportedCurrency) {
  return CURRENCY_METADATA[currency].fractionDigits;
}

export function getCurrencyDisplayName(locale: string, currency: SupportedCurrency) {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: "currency" });
    return displayNames.of(currency) ?? currency;
  } catch {
    return currency;
  }
}

export function getLocalizedAppName(locale: AppLocale) {
  switch (locale) {
    case "ja":
      return "スプリタ";
    case "zh-CN":
      return "AA记";
    case "en":
    default:
      return "Splita";
  }
}
