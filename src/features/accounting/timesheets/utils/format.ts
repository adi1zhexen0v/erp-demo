import type { TFunction } from "i18next";
import type { Locale } from "@/shared/utils/types";
import { MONTHS_RU, MONTHS_KK, MONTHS_EN } from "@/shared/consts";
import { getInitials } from "@/shared/utils";

export { getInitials };

export function formatTimesheetPeriod(month: number, year: number, locale: Locale): string {
  const months = locale === "kk" ? MONTHS_KK : locale === "en" ? MONTHS_EN : MONTHS_RU;
  const monthName = months[month - 1] || "";
  return `${monthName} ${year}`;
}

export function getDayOfWeek(day: number, year: number, month: number, t: TFunction): string {
  const date = new Date(year, month - 1, day);
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return t(`detail.weekDays.${dayKeys[date.getDay()]}`);
}

