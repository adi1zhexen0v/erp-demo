import type { CreatePurchaseItemDto } from "../types";

export interface AmortizationResult {
  months?: number;
  rate?: number;
  monthlyAmount: number;
}

export interface CalculateAmortizationParams {
  item: CreatePurchaseItemDto;
  mode: "percentage" | "months";
}

export function calculateAmortization(params: CalculateAmortizationParams): AmortizationResult | null {
  const { item, mode } = params;
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unit_price) || 0;

  if (!quantity || !unitPrice) return null;

  const totalValue = quantity * unitPrice;

  if (mode === "percentage") {
    const rate = Number(item.depreciation_rate) || 0;
    if (rate > 0 && rate <= 1) {
      const months = Math.round(12 / rate);
      const monthlyAmount = (totalValue * rate) / 12;
      return { months, monthlyAmount };
    }
  } else {
    const months = item.useful_life_months || 0;
    if (months > 0) {
      const rate = 12 / months;
      const monthlyAmount = (totalValue * rate) / 12;
      return { rate, monthlyAmount };
    }
  }

  return null;
}

