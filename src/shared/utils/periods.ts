import type { TFunction } from "i18next";
import { MONTH_KEYS, QUARTER_MONTHS } from "@/shared/consts/periods";

export function getMonthKeysForQuarter(quarter: number): string[] {
  const monthIndices = QUARTER_MONTHS[quarter] || [];
  return monthIndices.map((idx) => MONTH_KEYS[idx]);
}

export function getLocalizedMonthNames(keys: string[], t: TFunction): string[] {
  return keys.map((key) => t(`months.${key}`));
}

