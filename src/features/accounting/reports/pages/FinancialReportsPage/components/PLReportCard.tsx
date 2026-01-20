import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, Clock, FavoriteChart, InfoCircle } from "iconsax-react";
import type { PLReportResponse, PLReportExpenseBreakdown } from "@/features/accounting/reports/types";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import { Badge, Dropdown, Skeleton, Toast } from "@/shared/ui";

interface PLReportCardProps {
  data?: PLReportResponse;
  isLoading?: boolean;
  error?: unknown;
}

function calculateTotalPayroll(expense_breakdown: PLReportExpenseBreakdown | null): number {
  if (!expense_breakdown) return 0;
  return (
    toNumber(expense_breakdown.payroll_expense) +
    toNumber(expense_breakdown.opvr_expense) +
    toNumber(expense_breakdown.so_expense) +
    toNumber(expense_breakdown.oosms_expense) +
    toNumber(expense_breakdown.sn_expense)
  );
}

export default function PLReportCard({ data, isLoading, error }: PLReportCardProps) {
  const { t } = useTranslation("ReportsPage");

  const [hoveredExpensesTooltip, setHoveredExpensesTooltip] = useState(false);
  const [hoveredNetIncomeTooltip, setHoveredNetIncomeTooltip] = useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = useState(true);
  const [isExpensesOpen, setIsExpensesOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
          <Skeleton width={32} height={32} circle />
          <Skeleton width={300} height={24} />
        </div>
        <div className="space-y-4">
          <Skeleton width="100%" height={100} />
          <Skeleton width="100%" height={150} />
          <Skeleton width="100%" height={60} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 aspect-square flex items-center justify-center background-brand-fill radius-xs">
            <Clock size={20} color="white" />
          </div>
          <h3 className="text-body-semibold-lg content-base-primary">{t("plReport.title")}</h3>
        </div>
        <div className="text-body-regular-md content-action-neutral">
          {error ? t("plReport.error") : t("plReport.noData")}
        </div>
      </div>
    );
  }

  const netIncomeNum = toNumber(data.net_income);
  const netIncomeColor = netIncomeNum >= 0 ? "content-action-positive" : "content-action-negative";

  const expense_breakdown = data.expense_breakdown;
  const totalPayroll = calculateTotalPayroll(expense_breakdown);
  const otherExpense = expense_breakdown ? toNumber(expense_breakdown.other_expense) : 0;

  const shouldShowFormula = expense_breakdown && (totalPayroll !== 0 || otherExpense !== 0);

  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square flex items-center justify-center surface-component-fill content-action-neutral radius-xs">
          <FavoriteChart size={16} color="currentColor" />
        </div>
        <h3 className="text-body-bold-lg content-base-primary">{t("plReport.title")}</h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border surface-base-stroke p-4 radius-md">
          <button
            onClick={() => setIsRevenueOpen(!isRevenueOpen)}
            className="w-full text-body-bold-lg content-base-primary text-center mb-4 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span>{t("plReport.revenueSection")}</span>
            <ArrowDown2
              size={16}
              color="currentColor"
              className={`transition-transform duration-200 ${isRevenueOpen ? "" : "rotate-180"}`}
            />
          </button>
          {isRevenueOpen && (
            <>
              {data.revenue.length > 0 ? (
                <div className="space-y-1">
                  {data.revenue.map((item) => (
                    <div key={item.code} className="flex justify-between text-body-regular-md">
                      <span className="content-base-secondary">
                        {item.code} {item.name}
                      </span>
                      <span className="content-base-primary text-body-bold-lg">{formatMoneyKzt(item.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-body-regular-md content-action-neutral">{t("plReport.noRevenue")}</div>
              )}
              <div className="flex justify-between text-body-semibold-md pt-2 border-t surface-base-stroke mt-2">
                <span className="text-body-regular-md content-action-neutral">{t("plReport.totalRevenueLabel")}</span>
                <span className="text-body-bold-lg content-action-positive">
                  {formatMoneyKzt(data.total_revenue)}
                </span>
              </div>
            </>
          )}
        </div>

        {data.expenses.length > 0 && (
          <div className="border surface-base-stroke p-4 radius-md">
            <button
              onClick={() => setIsExpensesOpen(!isExpensesOpen)}
              className="w-full text-body-bold-lg content-base-primary text-center mb-4 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span>{t("plReport.expensesSection")}</span>
              <ArrowDown2
                size={16}
                color="currentColor"
                className={`transition-transform duration-200 ${isExpensesOpen ? "" : "rotate-180"}`}
              />
            </button>
            {isExpensesOpen && (
              <div className="flex flex-col gap-4">
                {data.expenses.map((expense) => {
                  const expenseBreakdownItems = expense_breakdown
                    ? [
                        {
                          label: t("plReport.breakdown.payroll"),
                          value: toNumber(expense_breakdown.payroll_expense),
                          key: "payroll",
                        },
                        {
                          label: t("plReport.breakdown.opvr"),
                          value: toNumber(expense_breakdown.opvr_expense),
                          key: "opvr",
                        },
                        {
                          label: t("plReport.breakdown.so"),
                          value: toNumber(expense_breakdown.so_expense),
                          key: "so",
                        },
                        {
                          label: t("plReport.breakdown.oosms"),
                          value: toNumber(expense_breakdown.oosms_expense),
                          key: "oosms",
                        },
                        {
                          label: t("plReport.breakdown.sn"),
                          value: toNumber(expense_breakdown.sn_expense),
                          key: "sn",
                        },
                      ].filter((item) => item.value !== 0)
                    : [];

                  const otherExpenseValue = expense_breakdown ? toNumber(expense_breakdown.other_expense) : 0;
                  const hasBreakdown = expenseBreakdownItems.length > 0 || otherExpenseValue !== 0;

                  return (
                    <div key={expense.code} className="flex flex-col gap-4">
                      <div className="flex justify-between items-center gap-2">
                        <Badge text={`${expense.code} ${expense.name}`} variant="soft" color="info" />
                        <span className="content-base-primary font-semibold">{formatMoneyKzt(expense.amount)}</span>
                      </div>
                      {expense_breakdown && hasBreakdown && (
                        <div className="p-3 surface-component-fill radius-md">
                          <div className="flex flex-col gap-2 text-body-regular-sm">
                            {expenseBreakdownItems.map((item) => (
                              <div
                                key={item.key}
                                className="flex items-center justify-between pb-2 border-b surface-base-stroke">
                                <span className="text-body-regular-sm content-base-secondary">{item.label}</span>
                                <span className="content-base-primary text-body-bold-lg">
                                  {formatMoneyKzt(item.value.toString())}
                                </span>
                              </div>
                            ))}
                            {otherExpenseValue !== 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-body-regular-md content-base-secondary">
                                  {t("plReport.breakdownOther")}
                                </span>
                                <span className="content-base-primary text-body-bold-lg">
                                  {formatMoneyKzt(expense_breakdown.other_expense)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center p-3 surface-base-fill radius-md mt-2">
                              <span className="text-body-regular-md content-base-secondary">
                                {t("plReport.totalExpensesCode", { code: expense.code })}
                              </span>
                              <span className="content-base-primary text-body-bold-lg">
                                {formatMoneyKzt(expense.amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div
                  className="flex justify-between text-body-semibold-md pt-3 border-t surface-base-stroke relative"
                  onMouseEnter={() => setHoveredExpensesTooltip(true)}
                  onMouseLeave={() => setHoveredExpensesTooltip(false)}>
                  <Dropdown
                    open={hoveredExpensesTooltip && !!shouldShowFormula}
                    onClose={() => setHoveredExpensesTooltip(false)}
                    direction="bottom"
                    align="left"
                    width="w-80"
                    className="elevation-level-2!">
                    <span className="text-body-regular-md content-action-neutral flex items-center gap-1 cursor-pointer">
                      <InfoCircle size={16} color="currentColor" /> {t("plReport.totalExpensesLabel")}:
                    </span>
                    {shouldShowFormula && expense_breakdown && (
                      <div
                        className="p-3 flex flex-col gap-2 min-w-64"
                        onMouseEnter={() => setHoveredExpensesTooltip(true)}
                        onMouseLeave={() => setHoveredExpensesTooltip(false)}>
                        <p className="text-body-regular-md content-action-neutral">{t("plReport.formula")}</p>
                        <span className="text-body-bold-md content-base-primary">
                          {t("plReport.payrollFormula", {
                            payroll: formatMoneyKzt(totalPayroll.toString()),
                            other: formatMoneyKzt(expense_breakdown.other_expense || 0),
                            total: formatMoneyKzt(data.total_expenses),
                          })}
                        </span>
                      </div>
                    )}
                  </Dropdown>
                  <span className="content-base-primary text-body-bold-lg">
                    {formatMoneyKzt(data.total_expenses)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className="flex justify-between text-body-semibold-md pt-3 border-t surface-base-stroke relative"
          onMouseEnter={() => setHoveredNetIncomeTooltip(true)}
          onMouseLeave={() => setHoveredNetIncomeTooltip(false)}>
          <Dropdown
            open={hoveredNetIncomeTooltip}
            onClose={() => setHoveredNetIncomeTooltip(false)}
            direction="bottom"
            align="left"
            width="w-80"
            className="elevation-level-2!">
            <span className="text-body-regular-md content-action-neutral flex items-center gap-1 cursor-pointer">
              <InfoCircle size={16} color="currentColor" /> {t("plReport.profitLoss")}
            </span>
            <div
              className="p-3 flex flex-col gap-2 min-w-64"
              onMouseEnter={() => setHoveredNetIncomeTooltip(true)}
              onMouseLeave={() => setHoveredNetIncomeTooltip(false)}>
              <p className="text-body-regular-md content-action-neutral">{t("plReport.formula")}</p>
              <span className="text-body-bold-md content-base-primary">
                {t("plReport.resultFormula", {
                  revenue: formatMoneyKzt(data.total_revenue),
                  expenses: formatMoneyKzt(data.total_expenses),
                  netIncome: formatMoneyKzt(data.net_income),
                })}
              </span>
            </div>
          </Dropdown>
          <span className={`text-body-bold-lg ${netIncomeColor}`}>{formatMoneyKzt(data.net_income)}</span>
        </div>

        <Toast color="grey" text={t("plReport.note")} closable={false} autoClose={false} />
      </div>
    </div>
  );
}

