import type { Locale } from "./types";

function getLocale(): Locale {
  const lang = typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : "ru";
  return (lang as Locale) || "ru";
}

export function formatMoneyKzt(amount: string | number, locale?: Locale, showDecimals?: boolean): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 ₸";

  const currentLocale = locale || getLocale();

  const hasNonZeroDecimals = num % 1 !== 0;
  const shouldShowDecimals = showDecimals === false ? false : hasNonZeroDecimals;

  const formatted = new Intl.NumberFormat(
    currentLocale === "kk" ? "kk-KZ" : currentLocale === "en" ? "en-US" : "ru-RU",
    {
      minimumFractionDigits: shouldShowDecimals ? 2 : 0,
      maximumFractionDigits: shouldShowDecimals ? 2 : 0,
    },
  ).format(num);

  return `${formatted} ₸`;
}
