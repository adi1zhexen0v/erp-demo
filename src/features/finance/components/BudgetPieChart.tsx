import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FavoriteChart } from "iconsax-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAppSelector } from "@/shared/hooks/redux";
import { selectTheme } from "@/features/settings";
import { formatCurrencyNoDecimals, formatPercentage, parseMoney, getLocalizedText, removeSectionNumber, getSectionColor, transformSectionsForPieChart, clampProgressWidth } from "../utils";
import type { BudgetSection } from "../types/api";

interface BudgetPieChartProps {
  sections: BudgetSection[];
  onSectionClick: (section: BudgetSection) => void;
}


export function BudgetPieChart({ sections, onSectionClick }: BudgetPieChartProps) {
  const { t, i18n } = useTranslation("FinancePage");
  const locale = i18n.language || "ru";
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";
  const centerFillColor = isDark ? "#121418" : "#ffffff";

  const plannedData = useMemo(() => {
    return transformSectionsForPieChart(sections, isDark, locale);
  }, [sections, isDark, locale]);

  if (plannedData.length === 0) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5 flex items-center justify-center h-96">
        <div className="text-body-regular-lg content-base-secondary">{t("chart.emptyState")}</div>
      </div>
    );
  }

  const hoveredSlice = hoveredSection ? plannedData.find((item) => item.section.id === hoveredSection) : null;

  function CustomTooltip() {
    if (!hoveredSlice) return null;

    return (
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 pointer-events-none"
        style={{ zIndex: 11000 }}>
        <div className="surface-base-fill border surface-base-stroke rounded-lg p-4 shadow-lg min-w-[220px]">
          <div className="text-body-bold-lg content-base-primary mb-4">
            {removeSectionNumber(getLocalizedText(hoveredSlice.section.name, locale))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center gap-5">
              <span className="text-body-regular-md content-base-secondary">{t("chart.planned")}</span>
              <span className="text-body-bold-md content-base-primary">
                {formatCurrencyNoDecimals(hoveredSlice.section.planned_total)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-5">
              <span className="text-body-regular-md content-base-secondary">{t("chart.spent")}</span>
              <span className="text-body-bold-md content-base-primary">
                {formatCurrencyNoDecimals(hoveredSlice.section.total)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-5">
              <span className="text-body-regular-md content-base-secondary">{t("chart.remaining")}</span>
              <span className="text-body-bold-md content-base-primary">
                {formatCurrencyNoDecimals(
                  (parseMoney(hoveredSlice.section.planned_total) - parseMoney(hoveredSlice.section.total)).toString(),
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-5">
                <span className="text-body-regular-md content-base-secondary">{t("chart.execution")}</span>
                <span className="text-body-bold-md content-base-primary">
                  {formatPercentage(hoveredSlice.section.execution_percentage)}
                </span>
              </div>
              <div className="border rounded-full surface-base-stroke">
                <div className="w-full h-4 border-2 border-white dark:border-black rounded-full overflow-hidden surface-base-fill">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${clampProgressWidth(hoveredSlice.section.execution_percentage)}%`,
                      backgroundColor: hoveredSlice.color,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5 flex flex-col h-full">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke mb-6">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <FavoriteChart size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("chart.title")}</span>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-5 flex-1">
        <div className="relative flex flex-col items-center justify-center">
          <style>
            {`
              .budget-pie-chart path:focus,
              .budget-pie-chart path:active {
                outline: none !important;
              }
            `}
          </style>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart className="budget-pie-chart" style={{ outline: "none" }}>
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
                </filter>
              </defs>
              <Pie
                data={plannedData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={80}
                startAngle={-90}
                endAngle={270}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
                onMouseEnter={(_, index) => {
                  const item = plannedData[index];
                  if (item) setHoveredSection(item.section.id);
                }}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={(_, index) => {
                  const item = plannedData[index];
                  if (item) onSectionClick(item.section);
                }}>
                {plannedData.map((entry, index) => (
                  <Cell
                    key={`planned-${index}`}
                    fill={entry.color}
                    stroke="none"
                    style={{ cursor: "pointer", outline: "none" }}
                  />
                ))}
              </Pie>
              <circle cx="50%" cy="50%" r={80} fill={centerFillColor} />
            </PieChart>
          </ResponsiveContainer>
          <CustomTooltip />
        </div>

        <div className="flex flex-col gap-3">
          {sections.map((section) => {
            const color = getSectionColor(section.id, isDark);
            return (
              <div
                key={section.id}
                className="flex items-center gap-3 p-3 radius-md border surface-base-stroke cursor-pointer hover:surface-tertiary-fill transition-colors"
                onClick={() => onSectionClick(section)}>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                <div className="flex-1">
                  <div className="text-body-regular-md content-action-neutral">{removeSectionNumber(getLocalizedText(section.name, locale))}</div>
                  <div className="text-body-bold-md content-base-primary">
                    {formatCurrencyNoDecimals(section.planned_total)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

