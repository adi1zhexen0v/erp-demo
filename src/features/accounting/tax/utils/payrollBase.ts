import { toNumber } from "@/shared/utils";

export function calculateSocialTaxBase(accruedIncome: string, opv: string): string {
  return (toNumber(accruedIncome) - toNumber(opv)).toString();
}

