import { TickCircle } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectTheme } from "@/features/settings";
import { formatCurrencyNoDecimals, formatPercentage, getLocalizedText, removeSectionNumber, getSectionColor, calculateExecutionPercentage, clampProgressWidth } from "../utils";
import type { BudgetSection } from "../types/api";

interface BudgetFooterSummaryProps {
  grandTotal: string;
  plannedBudget: string;
  sections: BudgetSection[];
}

export function BudgetFooterSummary({ grandTotal, plannedBudget, sections }: BudgetFooterSummaryProps) {
  const { t, i18n } = useTranslation("FinancePage");
  const locale = i18n.language || "ru";
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  function getShortSectionName(sectionId: string, sectionName: string | { ru: string; kk: string; en: string }): string {
    if (sectionId === "admin" || sectionId === "mto" || sectionId === "direct") {
      return t(`sections.short.${sectionId}` as any);
    }
    return removeSectionNumber(getLocalizedText(sectionName, locale));
  }

  return (
    <div className="radius-lg border surface-base-stroke background-base-primary p-5">
      <div className="flex items-center justify-between gap-3 pb-3 border-b surface-base-stroke">
        <div className="flex items-center justify-start gap-3">
          <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
            <span className="content-action-neutral">
              <TickCircle size={16} color="currentColor" variant="Bold" />
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-body-bold-lg content-base-primary">{t("footer.total")}</span>
            <p className="text-body-regular-sm content-action-neutral">{t("footer.totalDescription")}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-display-2xs content-base-primary text-right">{formatCurrencyNoDecimals(grandTotal)}</p>
          <p className="text-body-regular-sm content-action-neutral">
            {t("footer.ofPlanned", { amount: formatCurrencyNoDecimals(plannedBudget) })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        {sections.map((section) => {
          const sectionColor = getSectionColor(section.id, isDark);
          const sectionExecutionPercent = calculateExecutionPercentage(section.planned_total, section.total);

          return (
            <div key={section.id} className="radius-lg surface-component-fill p-5 flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-body-bold-md content-action-neutral">{getShortSectionName(section.id, section.name)}</div>
                <div className="text-display-2xs content-base-primary">{formatCurrencyNoDecimals(section.total)}</div>
              </div>
              <div className="border rounded-full surface-base-stroke relative">
                <div className="w-full h-4 border-2 border-white dark:border-black rounded-full overflow-hidden surface-base-fill relative">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${clampProgressWidth(sectionExecutionPercent)}%`,
                      backgroundColor: sectionColor,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-label-xs content-base-primary">
                      {formatPercentage(sectionExecutionPercent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
