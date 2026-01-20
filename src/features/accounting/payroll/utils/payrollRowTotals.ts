import { toNumber } from "@/shared/utils";
import type { PayrollListResponse } from "../types";

export interface PayrollRowTotals {
  gross: number;
  net: number;
  taxes: number;
  employerCost: number;
}

export function getPayrollRowTotals(payroll: PayrollListResponse): PayrollRowTotals {
  const gross = toNumber(payroll.total_gross_salary) + (payroll.gph_payments_gross || 0);
  const net = toNumber(payroll.total_net_salary) + (payroll.gph_payments_net || 0);
  const taxes =
    toNumber(payroll.total_employee_deductions) +
    toNumber(payroll.total_employer_contributions) +
    ((payroll.gph_payments_gross || 0) - (payroll.gph_payments_net || 0));
  const employerCost =
    toNumber(payroll.total_gross_salary) +
    toNumber(payroll.total_employer_contributions) +
    (payroll.gph_payments_gross || 0);

  return { gross, net, taxes, employerCost };
}

