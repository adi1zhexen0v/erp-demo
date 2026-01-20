import { parseMoney } from "./format";
import type { MoneyString } from "./format";

export function calculateExecutionPercentage(planned: MoneyString | number, total: MoneyString | number): number {
  const plannedNum = typeof planned === "string" ? parseMoney(planned) : planned;
  if (plannedNum === 0) {
    return 0;
  }
  const totalNum = typeof total === "string" ? parseMoney(total) : total;
  return (totalNum / plannedNum) * 100;
}

export function calculateRemaining(planned: MoneyString | number, total: MoneyString | number): number {
  const plannedNum = typeof planned === "string" ? parseMoney(planned) : planned;
  const totalNum = typeof total === "string" ? parseMoney(total) : total;
  return plannedNum - totalNum;
}

export function getRemainingColor(remaining: MoneyString | number): string {
  const remainingNum = typeof remaining === "string" ? parseMoney(remaining) : remaining;
  return remainingNum < 0 ? "content-action-negative" : "content-base-primary";
}

export function clampProgressWidth(percentage: number): number {
  return Math.max(0, Math.min(100, percentage));
}

