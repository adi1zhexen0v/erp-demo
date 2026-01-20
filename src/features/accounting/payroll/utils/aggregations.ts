import { toNumber } from "@/shared/utils";
import type { GPHPayment } from "../types";

export interface AggregatedTotals {
  gross: string;
  deductions: string;
  net: string;
  employerCost: string;
}

export function aggregatePayrollTotals(
  payrollGross: string,
  payrollDeductions: string,
  payrollNet: string,
  payrollEmployerCost: string,
  gphPayments: GPHPayment[] = [],
): AggregatedTotals {
  const payrollGrossNum = toNumber(payrollGross);
  const payrollDeductionsNum = toNumber(payrollDeductions);
  const payrollNetNum = toNumber(payrollNet);
  const payrollEmployerCostNum = toNumber(payrollEmployerCost);

  const gphGross = gphPayments.reduce((sum, payment) => sum + toNumber(payment.gross_amount), 0);
  const gphDeductions = gphPayments.reduce((sum, payment) => sum + toNumber(payment.total_withheld), 0);
  const gphNet = gphPayments.reduce((sum, payment) => sum + toNumber(payment.net_amount), 0);
  const gphEmployerCost = gphPayments.reduce((sum, payment) => sum + toNumber(payment.total_cost), 0);

  return {
    gross: (payrollGrossNum + gphGross).toFixed(2),
    deductions: (payrollDeductionsNum + gphDeductions).toFixed(2),
    net: (payrollNetNum + gphNet).toFixed(2),
    employerCost: (payrollEmployerCostNum + gphEmployerCost).toFixed(2),
  };
}

export interface GPHTotals {
  opv: number;
  vosms: number;
  ipn: number;
  so: number;
  net: number;
  totalWithheld: number;
}

export function aggregateGPHTotals(gphPayments: GPHPayment[] = []): GPHTotals {
  const gphOpv = gphPayments.reduce((sum, p) => sum + toNumber(p.opv), 0);
  const gphVosms = gphPayments.reduce((sum, p) => sum + toNumber(p.vosms), 0);
  const gphIpn = gphPayments.reduce((sum, p) => sum + toNumber(p.ipn), 0);
  const gphSo = gphPayments.reduce((sum, p) => sum + toNumber(p.so), 0);
  const gphNet = gphPayments.reduce((sum, p) => sum + toNumber(p.net_amount), 0);
  const gphTotalWithheld = gphPayments.reduce((sum, p) => sum + toNumber(p.total_withheld), 0);

  return {
    opv: gphOpv,
    vosms: gphVosms,
    ipn: gphIpn,
    so: gphSo,
    net: gphNet,
    totalWithheld: gphTotalWithheld,
  };
}

