import { useTranslation } from "react-i18next";
import { InfoCircle } from "iconsax-react";
import { useBudgetLimitError } from "../hooks/useBudgetLimitError";
import { formatCurrency } from "../utils";
import { getSectionName } from "../utils/errors";

interface Props {
  error: unknown;
  onClose?: () => void;
}

export function BudgetLimitErrorAlert({ error, onClose }: Props) {
  const { t } = useTranslation("FinancePage");
  const { getErrorDetails } = useBudgetLimitError();
  const details = getErrorDetails(error);

  if (!details) return null;

  const sectionName = getSectionName(details.section, t);

  return (
    <div className="border border-red-300 dark:border-red-700 radius-lg p-4 background-red-50 dark:background-red-900/20">
      <div className="flex items-start gap-3">
        <InfoCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h4 className="text-body-bold-md text-red-900 dark:text-red-100 mb-2">
            {t("errors.budgetExceeded", { section: sectionName })}
          </h4>
          <div className="space-y-1 text-body-regular-sm text-red-800 dark:text-red-200">
            <div className="flex justify-between">
              <span>{t("errors.limit")}</span>
              <span className="font-medium">{formatCurrency(details.limit)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("errors.spent")}</span>
              <span className="font-medium">{formatCurrency(details.spent)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("errors.available")}</span>
              <span className="font-medium">{formatCurrency(details.available)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("errors.requested")}</span>
              <span className="font-medium">{formatCurrency(details.requested)}</span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-3 text-body-regular-sm text-red-700 dark:text-red-300 hover:underline">
              {t("errors.close")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
