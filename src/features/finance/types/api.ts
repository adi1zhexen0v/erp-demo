export type MoneyString = string;

export type LocalizedString = {
  ru: string;
  kk: string;
  en: string;
};

export interface BudgetItem {
  name: LocalizedString;
  amount: MoneyString;
  date: string;
  account: string;
  source_id: number;
  source_type: string;
  group_id: string;
  group_name: LocalizedString;
  entry_type: string;
}

export interface BudgetSubcategory {
  id: string;
  name: LocalizedString;
  total: MoneyString;
  planned: MoneyString;
  grant_amount: MoneyString;
  own_contribution: MoneyString;
  is_trackable: boolean;
  execution_percentage: number;
  remaining: MoneyString;
  items: BudgetItem[];
}

export type BudgetSectionId = "admin" | "mto" | "direct" | string;

export interface BudgetSection {
  id: BudgetSectionId;
  name: LocalizedString;
  total: MoneyString;
  planned_total: MoneyString;
  execution_percentage: number;
  subcategories: BudgetSubcategory[];
}

export interface MissingFeature {
  id: string;
  name: string;
  section: string;
  planned: string;
  note: string;
}

export interface BudgetCoverage {
  total_items: number;
  trackable_items: number;
  untrackable_items: number;
  coverage_percentage: number;
  trackable_amount: MoneyString;
  untrackable_amount: MoneyString;
  missing_features: MissingFeature[];
}

export interface BudgetSummary {
  sections: BudgetSection[];
  grand_total: MoneyString;
  planned_budget: MoneyString;
  planned_grant_amount: MoneyString;
  planned_own_contribution: MoneyString;
  execution_percentage: number;
  remaining_budget: MoneyString;
  period: {
    start_date: string;
    end_date: string;
  };
  status_filter: string;
  coverage: BudgetCoverage;
}

export interface BudgetLimitErrorDetails {
  section: "admin" | "mto" | "direct";
  limit: string;
  spent: string;
  requested: string;
  available: string;
}

export interface BudgetLimitErrorResponse {
  error: string;
  type: "BudgetLimitExceeded";
  details: BudgetLimitErrorDetails;
}

export function isBudgetLimitError(error: unknown): error is { response: { data: BudgetLimitErrorResponse } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    (error as any).response?.data?.type === "BudgetLimitExceeded"
  );
}

