export const APP_NAME = "SplitEase MVP";
export const CURRENCY_CODE = "JPY";
export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "ja", "zh-CN"] as const;

export type AppLocale = (typeof LOCALES)[number];
