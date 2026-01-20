export { default as TaxPage } from "./pages/TaxPage";

export {
  citApi,
  useGetCitForm100Query,
  useGetCitForm10001Query,
  useGetCitForm10002Query,
  useGetCitForm10007Query,
  payrollTaxApi,
  useGetPayrollTaxForm200Query,
  useGetPayrollTaxForm20001Query,
  useGetPayrollTaxForm20005Query,
  useGetPayrollTaxQuartersQuery,
  useGetPayrollTaxSummaryQuery,
} from "./api";

export { useTaxPage } from "./hooks";
export type { UseTaxPageReturn } from "./hooks";

export type {
  Form100Data,
  Form100Income,
  Form100Deductions,
  Form100TaxCalculation,
  Form100AccountDetail,
  Form10001Data,
  Form10001VendorEntry,
  Form10002Data,
  Form10002Group,
  Form10007Data,
  Form10007Assets,
  Form10007Liabilities,
  Form10007Equity,
  Form200MonthlyData,
  Form200MonthlyDetailed,
  Form20000Response,
  Form20001Response,
  Form20005EmployeeEntry,
  Form20005MonthData,
  Form20005Response,
  AvailableQuartersResponse,
  QuarterSummaryResponse,
} from "./types/api";

export { formatRate } from "./utils";

export type { TaxType, CITFormCode, PayrollFormCode, TaxFormCode } from "./consts";
export { CIT_FORMS, PAYROLL_FORMS, DEFAULT_CIT_FORM, DEFAULT_PAYROLL_FORM } from "./consts";
