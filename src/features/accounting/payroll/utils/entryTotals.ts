import { toNumber } from "@/shared/utils";
import type { PayrollEntry } from "../types";

export interface PayrollEntryTotals {
  gross: number;
  deductions: number;
  employerContribs: number;
  totalTaxes: number;
  employerCost: number;
}

export function getPayrollEntryTotals(entry: PayrollEntry): PayrollEntryTotals {
  const gross = toNumber(entry.gross_salary);
  const deductions = toNumber(entry.total_employee_deductions);
  const employerContribs = toNumber(entry.total_employer_contributions);
  const totalTaxes = deductions + employerContribs;
  const employerCost = gross + employerContribs;

  return { gross, deductions, employerContribs, totalTaxes, employerCost };
}

