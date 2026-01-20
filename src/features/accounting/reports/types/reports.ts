export interface PLReportRevenueItem {
  code: string;
  name: string;
  amount: string;
}

export interface PLReportExpenseItem {
  code: string;
  name: string;
  amount: string;
}

export interface PLReportExpenseBreakdown {
  payroll_expense: string;
  opvr_expense: string;
  so_expense: string;
  oosms_expense: string;
  sn_expense: string;
  purchase_expense: string;
  depreciation_expense: string;
  other_expense: string;
}

export interface PLReportResponse {
  organization_id: number;
  start_date: string;
  end_date: string;
  revenue: PLReportRevenueItem[];
  expenses: PLReportExpenseItem[];
  total_revenue: string;
  total_expenses: string;
  net_income: string;
  expense_breakdown: PLReportExpenseBreakdown | null;
}

export interface BalanceSheetItem {
  code: string;
  name: string;
  amount: string;
}

export interface BalanceSheetSection {
  title: string;
  items: BalanceSheetItem[];
  total: string;
}

export interface BalanceSheetResponse {
  organization_id: number;
  as_of_date: string;
  assets: {
    current_assets: BalanceSheetSection;
    fixed_assets: BalanceSheetSection;
    total: string;
  };
  liabilities: {
    current_liabilities: BalanceSheetSection;
    total: string;
  };
  equity: {
    title: string;
    items: BalanceSheetItem[];
    total: string;
  };
  total_liabilities_and_equity: string;
  is_balanced: boolean;
}

export interface CashFlowResponse {
  organization_id: number;
  start_date: string;
  end_date: string;
  opening_cash: string;
  inflows: {
    total: string;
  };
  outflows: {
    salary_payments: string;
    tax_payments: string;
    pension_payments: string;
    social_payments: string;
    vendor_payments: string;
    total: string;
  };
  net_cash_change: string;
  closing_cash: string;
}

export interface TrialBalanceRow {
  code: string;
  name: string;
  opening_debit: string;
  opening_credit: string;
  debit_turnover: string;
  credit_turnover: string;
  closing_debit: string;
  closing_credit: string;
}

export interface TrialBalanceResponse {
  organization_id: number;
  start_date: string;
  end_date: string;
  rows: TrialBalanceRow[];
  total_debit: string;
  total_credit: string;
  is_balanced: boolean;
}

export interface MultilingualText {
  ru: string;
  kk?: string;
  en?: string;
}

export interface JournalEntryListItem {
  id: number;
  entry_date: string;
  debit_account: string;
  credit_account: string;
  amount: string;
  description: MultilingualText;
  description_text: string;
  source_type: string;
  status: string;
}

export type JournalEntriesResponse = JournalEntryListItem[];

export interface DepreciationSummary {
  total_assets_count: number;
  total_monthly_depreciation: string;
  total_accumulated_depreciation: string;
  total_initial_cost: string;
  total_residual_value: string;
  report_month: string;
  report_date: string;
}

export interface DepreciationAsset {
  id: number;
  unit_id: number;
  name: string;
  asset_type: "fixed_asset" | "intangible";
  asset_type_display: string;
  depreciation_rate: string;
  depreciation_rate_display: string;
  initial_cost: string;
  residual_value: string;
  monthly_depreciation: string;
  accumulated_depreciation: string;
  useful_life_months: number | null;
  last_depreciation_date: string | null;
  next_depreciation_date: string | null;
  months_depreciated: number;
  is_fully_depreciated: boolean;
}

export interface DepreciationReport {
  summary: DepreciationSummary;
  assets: DepreciationAsset[];
}
