import { DocumentText, ReceiptEdit, Buildings, Chart, Calculator, Profile2User } from "iconsax-react";
import type { Icon } from "iconsax-react";

export type TaxType = "cit" | "payroll";

export const CIT_FORMS = ["100.00", "100.01", "100.02", "100.07"] as const;
export const PAYROLL_FORMS = ["200.00", "200.01", "200.05"] as const;

export type CITFormCode = (typeof CIT_FORMS)[number];
export type PayrollFormCode = (typeof PAYROLL_FORMS)[number];
export type TaxFormCode = CITFormCode | PayrollFormCode;

export const DEFAULT_CIT_FORM: CITFormCode = "100.00";
export const DEFAULT_PAYROLL_FORM: PayrollFormCode = "200.00";

export const MAIN_TAB_ICONS: Record<TaxType, Icon> = {
  cit: DocumentText,
  payroll: Profile2User,
};

export const CIT_FORM_ICONS: Record<CITFormCode, Icon> = {
  "100.00": DocumentText,
  "100.01": ReceiptEdit,
  "100.02": Buildings,
  "100.07": Chart,
};

export const PAYROLL_FORM_ICONS: Record<PayrollFormCode, Icon> = {
  "200.00": DocumentText,
  "200.01": Calculator,
  "200.05": Profile2User,
};
