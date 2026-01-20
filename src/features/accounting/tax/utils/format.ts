import { toNumber } from "@/shared/utils";
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

export function formatRate(value: string | number, locale?: Locale): string {
  const rate = typeof value === "string" ? toNumber(value) : value;
  const percentage = rate * 100;
  const localeString = getLocaleString(locale);
  const formatter = new Intl.NumberFormat(localeString, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(percentage)}%`;
}

