export const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export const QUARTER_MONTHS: Record<number, number[]> = {
  1: [0, 1, 2],
  2: [3, 4, 5],
  3: [6, 7, 8],
  4: [9, 10, 11],
};

