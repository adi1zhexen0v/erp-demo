import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, Clock, InfoCircle, MoneyRecive } from "iconsax-react";
import type { CashFlowResponse } from "@/features/accounting/reports/types";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import { Dropdown, Skeleton, Toast } from "@/shared/ui";

interface CashFlowCardProps {
  data?: CashFlowResponse;
  isLoading?: boolean;
  error?: unknown;
}

export default function CashFlowCard({ data, isLoading, error }: CashFlowCardProps) {
  const { t } = useTranslation("ReportsPage");

  const [hoveredOutflowsTooltip, setHoveredOutflowsTooltip] = useState(false);
  const [isOperatingOpen, setIsOperatingOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
          <Skeleton width={32} height={32} circle />
          <Skeleton width={300} height={24} />
        </div>
        <div className="space-y-4">
          <Skeleton width="100%" height={100} />
          <Skeleton width="100%" height={200} />
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
          <h3 className="text-body-semibold-lg content-base-primary">{t("cashFlow.title")}</h3>
        </div>
        <div className="text-body-regular-md content-action-neutral">
          {error ? t("cashFlow.error") : t("cashFlow.noData")}
        </div>
      </div>
    );
  }

  const _openingCashNum = toNumber(data.opening_cash);
  const closingCashNum = toNumber(data.closing_cash);
  const netChangeNum = toNumber(data.net_cash_change);

  const outflowsItems = [
    { label: t("cashFlow.outflows.salary"), value: toNumber(data.outflows.salary_payments), key: "salary" },
    { label: t("cashFlow.outflows.tax"), value: toNumber(data.outflows.tax_payments), key: "tax" },
    { label: t("cashFlow.outflows.social"), value: toNumber(data.outflows.social_payments), key: "social" },
    { label: t("cashFlow.outflows.vendor"), value: toNumber(data.outflows.vendor_payments), key: "vendor" },
  ].filter((item) => item.value !== 0);

  const hasOutflows = outflowsItems.length > 0;

  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square flex items-center justify-center surface-component-fill content-action-neutral radius-xs">
          <MoneyRecive size={16} color="currentColor" />
        </div>
        <h3 className="text-body-bold-lg content-base-primary">{t("cashFlow.title")}</h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="p-3 surface-component-fill radius-md">
          <div className="flex justify-between gap-3 text-body-regular-md">
            <span className="content-base-secondary text-body-regular-md">{t("cashFlow.openingBalance")}</span>
            <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
              {formatMoneyKzt(data.opening_cash)}
            </span>
          </div>
        </div>

        <div className="border surface-base-stroke p-4 radius-md">
          <button
            onClick={() => setIsOperatingOpen(!isOperatingOpen)}
            className="w-full text-body-bold-lg content-base-primary text-center mb-4 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span>{t("cashFlow.operatingActivities")}</span>
            <ArrowDown2
              size={16}
              color="currentColor"
              className={`transition-transform duration-200 ${isOperatingOpen ? "" : "rotate-180"}`}
            />
          </button>
          {isOperatingOpen && (
            <div className="flex flex-col gap-4">
              {hasOutflows && (
                <div className="p-3 surface-component-fill radius-md">
                  <div className="flex flex-col gap-4 text-body-regular-sm">
                    {outflowsItems.map((item, index, array) => (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between gap-3 ${index < array.length - 1 ? "pb-2 border-b surface-base-stroke" : ""}`}>
                        <span className="text-body-regular-sm content-base-secondary">{item.label}</span>
                        <span className="content-action-negative text-body-bold-lg whitespace-nowrap">
                          ({formatMoneyKzt(item.value.toString())})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="flex justify-between text-body-bold-md pt-3 border-t surface-base-stroke relative"
                onMouseEnter={() => setHoveredOutflowsTooltip(true)}
                onMouseLeave={() => setHoveredOutflowsTooltip(false)}>
                <Dropdown
                  open={hoveredOutflowsTooltip && hasOutflows}
                  onClose={() => setHoveredOutflowsTooltip(false)}
                  direction="bottom"
                  align="left"
                  width="w-80"
                  className="elevation-level-2!">
                  <span className="text-body-regular-md content-action-neutral flex items-center gap-1 cursor-pointer">
                    <InfoCircle size={16} color="currentColor" /> {t("cashFlow.totalOutflows")}
                  </span>
                  {hasOutflows && (
                    <div
                      className="p-3 flex flex-col gap-2 min-w-64"
                      onMouseEnter={() => setHoveredOutflowsTooltip(true)}
                      onMouseLeave={() => setHoveredOutflowsTooltip(false)}>
                      <p className="text-body-regular-md content-action-neutral">{t("plReport.formula")}</p>
                      <span className="text-body-bold-md content-base-primary">
                        {t("cashFlow.outflowsFormula", {
                          salary: formatMoneyKzt(data.outflows.salary_payments),
                          tax: formatMoneyKzt(data.outflows.tax_payments),
                          social: formatMoneyKzt(data.outflows.social_payments),
                          vendor: formatMoneyKzt(data.outflows.vendor_payments),
                          total: formatMoneyKzt(data.outflows.total),
                        })}
                      </span>
                    </div>
                  )}
                </Dropdown>
                <span className="content-action-negative text-body-bold-lg whitespace-nowrap">
                  ({formatMoneyKzt(data.outflows.total)})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between pt-3 border-t surface-base-stroke">
            <span className="text-body-regular-md content-action-neutral">{t("cashFlow.netChange")}</span>
            <span
              className={`text-body-bold-lg whitespace-nowrap ${netChangeNum >= 0 ? "content-action-positive" : "content-action-negative"}`}>
              {formatMoneyKzt(data.net_cash_change)}
            </span>
          </div>

          <div className="flex justify-between pt-3 border-t surface-base-stroke">
            <span className="text-body-regular-md content-action-neutral flex items-center gap-1">
              {t("cashFlow.endingBalance")}
            </span>
            <span
              className={`text-body-bold-lg whitespace-nowrap ${closingCashNum >= 0 ? "content-action-positive" : "content-action-negative"}`}>
              {formatMoneyKzt(data.closing_cash)}
            </span>
          </div>
        </div>

        <Toast color="grey" text={t("cashFlow.note")} closable={false} autoClose={false} />
      </div>
    </div>
  );
}
