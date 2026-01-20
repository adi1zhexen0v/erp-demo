import type { TFunction } from "i18next";
import type { BudgetLimitErrorDetails, BudgetSectionId } from "../types/api";
import { formatCurrency } from "./format";

export function getSectionName(section: BudgetSectionId, t: TFunction<"FinancePage">): string {
  if (section !== "admin" && section !== "mto" && section !== "direct") {
    return section;
  }
  return t(`sections.${section}` as any);
}

export function formatBudgetLimitError(details: BudgetLimitErrorDetails, t: TFunction<"FinancePage">): string {
  const sectionName = getSectionName(details.section, t);
  const limit = formatCurrency(details.limit);
  const spent = formatCurrency(details.spent);
  const available = formatCurrency(details.available);
  const requested = formatCurrency(details.requested);

  return (
    t("errors.budgetExceeded", { section: sectionName }) +
    "\n\n" +
    t("errors.limit") +
    "        " +
    limit +
    "\n" +
    t("errors.spent") +
    " " +
    spent +
    "\n" +
    t("errors.available") +
    "     " +
    available +
    "\n" +
    t("errors.requested") +
    "    " +
    requested
  );
}

export function extractBudgetLimitError(error: unknown): BudgetLimitErrorDetails | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    (error as any).response?.data?.type === "BudgetLimitExceeded"
  ) {
    return (error as any).response.data.details;
  }
  return null;
}
