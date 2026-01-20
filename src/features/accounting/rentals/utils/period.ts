import type { Locale } from "@/shared/utils/types";
import { CALENDAR_LOCALE } from "@/shared/ui/DatePicker/locale";

export interface YearOption {
  label: string;
  value: number;
}

export interface MonthPeriodDates {
  start: Date;
  end: Date;
}

export interface MonthPeriodData {
  period: string;
  period_start_date: Date;
  period_end_date: Date;
}

export function getYearOptions(): YearOption[] {
  const currentYear = new Date().getFullYear();
  const years: YearOption[] = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    years.push({ label: String(i), value: i });
  }
  return years;
}

export function getMonthPeriodDates(year: number, month: number): MonthPeriodDates {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return {
    start: startDate,
    end: endDate,
  };
}

export function getMonthPeriodData(year: number, month: number, locale: Locale): MonthPeriodData {
  const monthNames = CALENDAR_LOCALE[locale].months;
  const period = `${monthNames[month]} ${year}`;
  const { start, end } = getMonthPeriodDates(year, month);
  return {
    period,
    period_start_date: start,
    period_end_date: end,
  };
}

export function validateAvrDate(avrDate: Date | null, periodStart: Date): boolean {
  if (!avrDate) return true;
  if (!periodStart) return true;

  const periodStartNormalized = new Date(periodStart);
  periodStartNormalized.setHours(0, 0, 0, 0);
  const avrDateNormalized = new Date(avrDate);
  avrDateNormalized.setHours(0, 0, 0, 0);

  return avrDateNormalized >= periodStartNormalized;
}




