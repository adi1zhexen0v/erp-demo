export function extractVatAmount(totalWithVat: number, vatRate: number): number {
  if (totalWithVat <= 0) return 0;
  return (totalWithVat * vatRate) / (1 + vatRate);
}

export function toVatPercent(vatRate: number): number {
  return Math.round(vatRate * 100);
}

