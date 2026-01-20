export function toPercent(rate: number): number {
  return Math.round(rate * 100);
}

export function getPassedMonths(accumulated: number, monthly: number): number {
  if (monthly <= 0) return 0;
  return Math.round(accumulated / monthly);
}

export function getUsefulLifeTotal(monthsUntilFully: number | undefined, passedMonths: number): number | null {
  if (monthsUntilFully === undefined) return null;
  return monthsUntilFully + passedMonths;
}

