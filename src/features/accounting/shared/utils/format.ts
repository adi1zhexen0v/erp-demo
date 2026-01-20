import type { Locale } from "@/shared/utils/types";

function getLocaleString(locale?: Locale): string {
  if (!locale) return "ru-RU";
  const localeMap: Record<Locale, string> = {
    ru: "ru-RU",
    kk: "kk-KZ",
    en: "en-US",
  };
  return localeMap[locale] || "ru-RU";
}

export function formatPercentageFromRate(rate: number, locale?: Locale): string {
  const percentage = rate * 100;
  const localeString = getLocaleString(locale);
  const formatter = new Intl.NumberFormat(localeString, {
    minimumFractionDigits: percentage % 1 === 0 ? 0 : 2,
    maximumFractionDigits: percentage % 1 === 0 ? 0 : 2,
  });
  return `${formatter.format(percentage)}%`;
}

export function formatPercentage(value: string | number, locale?: Locale): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const localeString = getLocaleString(locale);
  const formatter = new Intl.NumberFormat(localeString, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(num)}%`;
}

