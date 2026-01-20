export const DEFAULT_VAT_RATE = 0.16;

export function calculateNetAmount(total: number, vatRate: number): number {
  return total / (1 + vatRate);
}

export function calculateVatAmount(total: number, vatRate: number): number {
  const netAmount = calculateNetAmount(total, vatRate);
  return total - netAmount;
}

