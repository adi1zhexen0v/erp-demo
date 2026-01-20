import i18n from "@/app/i18n";
import { formatMoneyKzt } from "@/shared/utils";

export type MoneyString = string;

export function parseMoney(value: MoneyString): number {
  return parseFloat(value) || 0;
}

export function formatCurrency(value: MoneyString | number): string {
  return formatMoneyKzt(value);
}

export function formatCurrencyNoDecimals(value: MoneyString | number, locale?: string): string {
  const currentLocale = (locale || i18n.language || "ru") as "ru" | "kk" | "en";
  return formatMoneyKzt(value, currentLocale, false);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatAccountCode(account: string): string {
  return account.replace("→", "  →  ");
}

export function removeSectionNumber(name: string): string {
  return name.replace(/^\d+\.\s*/, "");
}

