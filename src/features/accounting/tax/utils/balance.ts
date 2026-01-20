import { toNumber } from "@/shared/utils";

export function isBalanceValid(assets: string, liabilities: string, equity: string): boolean {
  const totalAssets = toNumber(assets);
  const totalLiabilities = toNumber(liabilities);
  const totalEquity = toNumber(equity);
  return totalAssets === totalLiabilities + totalEquity;
}

