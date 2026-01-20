import { useTranslation } from "react-i18next";
import { extractBudgetLimitError, formatBudgetLimitError } from "../utils/errors";
import type { BudgetLimitErrorDetails } from "../types/api";

export function useBudgetLimitError() {
  const { t } = useTranslation("FinancePage");

  function getErrorDetails(error: unknown): BudgetLimitErrorDetails | null {
    return extractBudgetLimitError(error);
  }

  function getErrorMessage(error: unknown): string | null {
    const details = getErrorDetails(error);
    if (!details) return null;
    return formatBudgetLimitError(details, t);
  }

  return {
    getErrorDetails,
    getErrorMessage,
    isBudgetLimitError: (error: unknown) => getErrorDetails(error) !== null,
  };
}

