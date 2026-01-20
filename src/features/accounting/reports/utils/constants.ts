import { MONTHS_RU } from "@/shared/consts";

export function formatPeriod(year: number, month: number | null): string {
  if (month) {
    return `${MONTHS_RU[month - 1]} ${year}`;
  }
  return `${year} год`;
}

