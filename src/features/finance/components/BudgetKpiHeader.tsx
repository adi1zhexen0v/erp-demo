import { useTranslation } from "react-i18next";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { formatCurrencyNoDecimals, formatPercentage, getRemainingColor, clampProgressWidth } from "../utils";

interface BudgetKpiHeaderProps {
  plannedBudget: string;
  grandTotal: string;
  remainingBudget: string;
  executionPercentage: number;
}

export function BudgetKpiHeader({
  plannedBudget,
  grandTotal,
  remainingBudget,
  executionPercentage,
}: BudgetKpiHeaderProps) {
  const { t } = useTranslation("FinancePage");
  const remainingColor = getRemainingColor(remainingBudget);
  const progressWidth = clampProgressWidth(executionPercentage);

  return (
    <div className="flex flex-col gap-5 border p-5 radius-lg surface-base-stroke">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <TengeCircleIcon size={16} />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("kpi.title")}</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="radius-lg surface-component-fill p-5 flex flex-col gap-1">
          <div className="text-body-bold-md content-action-neutral">{t("kpi.plannedBudget")}</div>
          <div className="text-display-2xs content-base-primary">{formatCurrencyNoDecimals(plannedBudget)}</div>
        </div>

        <div className="radius-lg surface-component-fill p-5 flex flex-col gap-1">
          <div className="text-body-bold-md content-action-neutral">{t("kpi.actualExpenses")}</div>
          <div className="text-display-2xs content-base-primary">{formatCurrencyNoDecimals(grandTotal)}</div>
        </div>

        <div className="radius-lg surface-component-fill p-5 flex flex-col gap-1">
          <div className="text-body-bold-md content-action-neutral">{t("kpi.remaining")}</div>
          <div className={`text-display-2xs ${remainingColor}`}>{formatCurrencyNoDecimals(remainingBudget)}</div>
        </div>

        <div className="radius-lg surface-component-fill p-5 flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-body-bold-md content-action-neutral">{t("kpi.title")}</div>
            <div className="text-display-2xs content-base-primary">{formatPercentage(executionPercentage)}</div>
          </div>
          <div className="border rounded-full surface-base-stroke">
            <div className="w-full h-4 border-2 border-white dark:border-black rounded-full overflow-hidden surface-base-fill">
              <div
                className="h-full background-brand-fill transition-all duration-300"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
