export const APP_NAME = "Splita";
export const CURRENCY_CODE = "JPY";
export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "ja", "zh-CN"] as const;

export type AppLocale = (typeof LOCALES)[number];

export function getLocalizedAppName(locale: AppLocale) {
  switch (locale) {
    case "ja":
      return "スプリタ";
    case "zh-CN":
      return "A一下";
    case "en":
    default:
      return "Splita";
  }
}
