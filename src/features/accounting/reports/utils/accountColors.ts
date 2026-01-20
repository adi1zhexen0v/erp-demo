export const ACCOUNT_COLORS: Record<string, string> = {
  "1": "#10B981",
  "2": "#059669",
  "3": "#F59E0B",
  "5": "#8B5CF6",
  "6": "#34D399",
  "7": "#EF4444",
};

export function getAccountColor(code: string): string {
  const firstDigit = code[0];
  return ACCOUNT_COLORS[firstDigit] || "#6B7280";
}

export const CATEGORY_COLORS = {
  expenses: "#EF4444",
  liabilities: "#F59E0B",
  assets: "#10B981",
  cash: "#3B82F6",
  revenue: "#34D399",
  neutral: "#6B7280",
} as const;

