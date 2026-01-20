export interface Form100Data {
  organization_bin: string;
  organization_name: string;
  year: number;
  start_date: string | null;
  end_date: string | null;
  income: Form100Income;
  adjusted_gross_income: string;
  deductions: Form100Deductions;
  tax_calculation: Form100TaxCalculation;
  income_accounts: Form100AccountDetail[];
  expense_accounts: Form100AccountDetail[];
}

export interface Form100Income {
  sales_revenue: string;
  interest_income: string;
  royalty_income: string;
  rental_income: string;
  asset_disposal_gain: string;
  grant_income: string;
  foreign_exchange_gain: string;
  other_income: string;
  total_gross_income: string;
}

export interface Form100Deductions {
  cost_of_sales: string;
  labor_costs: string;
  social_contributions: string;
  interest_expense: string;
  fixed_asset_deductions: string;
  taxes_and_duties: string;
  depreciation: string;
  admin_expenses: string;
  other_expenses: string;
  total_deductions: string;
}

export interface Form100TaxCalculation {
  taxable_income: string;
  exempt_income: string;
  total_taxable_income: string;
  loss_carryforward: string;
  adjusted_taxable_income: string;
  cit_rate: string;
  cit_calculated: string;
  foreign_tax_credit: string;
  cit_payable: string;
  total_cit: string;
}

export interface Form100AccountDetail {
  code: string;
  name: string;
  amount: string;
}

export interface Form10001Data {
  organization_bin: string;
  year: number;
  entries: Form10001VendorEntry[];
  total_financial: string;
  total_advertising: string;
  total_consulting: string;
  total_marketing: string;
  total_design: string;
  total_engineering: string;
  total_other: string;
  grand_total: string;
}

export interface Form10001VendorEntry {
  row_number: number;
  vendor_bin: string;
  vendor_name: string;
  country_code: string;
  expense_type_code: number;
  expense_type_name: string;
  amount: string;
}

export interface Form10002Data {
  organization_bin: string;
  year: number;
  mrp: string;
  group_i: Form10002Group;
  group_ii: Form10002Group;
  group_iii: Form10002Group;
  group_iv: Form10002Group;
  leased_asset_expenses: string;
  total_fixed_asset_deductions: string;
}

export interface Form10002Group {
  group_code: string;
  group_name: string;
  depreciation_rate: string;
  opening_balance: string;
  additions: string;
  disposals: string;
  subsequent_costs: string;
  depreciation_base: string;
  depreciation: string;
  double_depreciation: string;
  disposal_loss: string;
  small_balance_writeoff: string;
  repair_expenses: string;
  total_deductions: string;
  closing_balance: string;
}

export interface Form10007Data {
  organization_bin: string;
  year: number;
  as_of_date: string | null;
  assets: Form10007Assets;
  liabilities: Form10007Liabilities;
  equity: Form10007Equity;
  is_balanced: boolean;
}

export interface Form10007Assets {
  cash: string;
  inventory: string;
  vat_receivable: string;
  fixed_assets_gross: string;
  fixed_assets_depreciation: string;
  fixed_assets_net: string;
  intangibles_gross: string;
  intangibles_amortization: string;
  intangibles_net: string;
  total_assets: string;
}

export interface Form10007Liabilities {
  accounts_payable: string;
  tax_liabilities: string;
  salary_payable: string;
  social_liabilities: string;
  total_liabilities: string;
}

export interface Form10007Equity {
  charter_capital: string;
  retained_earnings: string;
  current_period_result: string;
  total_equity: string;
}

export interface Form200MonthlyData {
  ipn: string;
  opv: string;
  opvr: string;
  sn: string;
  so: string;
  sn_payable: string;
  vosms_employee: string;
  vosms_employer: string;
  total_salary: string;
  employee_count: number;
}

export interface Form200MonthlyDetailed extends Form200MonthlyData {
  accrued_income: string;
  taxable_income: string;
  standard_deduction: string;
  mrp_deduction: string;
}

export interface Form20000Response {
  organization_bin: string;
  organization_name: string;
  year: number;
  quarter: number;
  start_date: string;
  end_date: string;
  month1: Form200MonthlyData;
  month2: Form200MonthlyData;
  month3: Form200MonthlyData;
  quarter_total: Form200MonthlyData;
  employee_count: number;
}

export interface Form20001Response {
  organization_bin: string;
  organization_name: string;
  year: number;
  quarter: number;
  start_date: string;
  end_date: string;
  month1: Form200MonthlyDetailed;
  month2: Form200MonthlyDetailed;
  month3: Form200MonthlyDetailed;
  quarter_total: Form200MonthlyDetailed;
  employee_count: number;
}

export interface Form20005EmployeeEntry {
  row_number: number;
  month: number;
  full_name: string;
  iin: string;
  status_code: string;
  category_code: string;
  accrued_income: string;
  taxable_income: string;
  opv_amount: string;
  vosms_employee_amount: string;
  standard_deduction: string;
  other_deductions: string;
  ipn_base: string;
  ipn_calculated: string;
  sn_base: string;
  sn_calculated: string;
  so_amount: string;
  sn_payable: string;
  vosms_employer_amount: string;
  opvr_amount: string;
}

export interface Form20005MonthData {
  month: number;
  entries: Form20005EmployeeEntry[];
  total_accrued_income: string;
  total_opv: string;
  total_vosms_employee: string;
  total_standard_deduction: string;
  total_ipn: string;
  total_sn: string;
  total_so: string;
  total_sn_payable: string;
  total_vosms_employer: string;
  total_opvr: string;
}

export interface Form20005Response {
  organization_bin: string;
  organization_name: string;
  year: number;
  quarter: number;
  month1: Form20005MonthData;
  month2: Form20005MonthData;
  month3: Form20005MonthData;
  entries: Form20005EmployeeEntry[];
  totals: Form20005EmployeeEntry;
  employee_count: number;
}

export interface AvailableQuartersResponse {
  year: number;
  quarters: number[];
}

export interface QuarterSummaryResponse {
  year: number;
  quarter: number;
  organization_name: string;
  employee_count: number;
  total_salary: string;
  total_ipn: string;
  total_opv: string;
  total_opvr: string;
  total_sn: string;
  total_so: string;
  total_sn_payable: string;
  total_vosms_employee: string;
  total_vosms_employer: string;
}

