import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, Clock, InfoCircle, DocumentText } from "iconsax-react";
import type { BalanceSheetResponse } from "@/features/accounting/reports/types";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { Badge, Dropdown, Skeleton } from "@/shared/ui";

interface BalanceSheetCardProps {
  data?: BalanceSheetResponse;
  isLoading?: boolean;
  error?: unknown;
}

export default function BalanceSheetCard({ data, isLoading, error }: BalanceSheetCardProps) {
  const { t } = useTranslation("ReportsPage");

  const [hoveredBalanceTooltip, setHoveredBalanceTooltip] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isLiabilitiesOpen, setIsLiabilitiesOpen] = useState(true);
  const [isEquityOpen, setIsEquityOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
          <Skeleton width={32} height={32} circle />
          <Skeleton width={300} height={24} />
        </div>
        <div className="space-y-4">
          <Skeleton width="100%" height={200} />
          <Skeleton width="100%" height={100} />
          <Skeleton width="100%" height={100} />
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
          <h3 className="text-body-semibold-lg content-base-primary">{t("balanceSheet.title")}</h3>
        </div>
        <div className="text-body-regular-md content-action-neutral">
          {error ? t("balanceSheet.error") : t("balanceSheet.noData")}
        </div>
      </div>
    );
  }

  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square flex items-center justify-center surface-component-fill content-action-neutral radius-xs">
          <DocumentText size={16} color="currentColor" />
        </div>
        <h3 className="text-body-bold-lg content-base-primary">{t("balanceSheet.title")}</h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border surface-base-stroke p-4 radius-md">
          <button
            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
            className="w-full text-body-bold-lg content-base-primary text-center mb-4 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span>{t("balanceSheet.assetsSection")}</span>
            <ArrowDown2
              size={16}
              color="currentColor"
              className={`transition-transform duration-200 ${isAssetsOpen ? "" : "rotate-180"}`}
            />
          </button>
          {isAssetsOpen && (
            <div className="flex flex-col gap-4">
              <div className="p-3 surface-component-fill radius-md">
                <div className="flex flex-col gap-4 text-body-regular-sm">
                  {data.assets.current_assets.items.length > 0 && (
                    <>
                      <div className="flex items-center justify-between gap-3 pb-2 border-b surface-base-stroke">
                        <span className="text-body-regular-sm content-base-secondary">
                          {data.assets.current_assets.title}
                        </span>
                        <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                          {formatMoneyKzt(data.assets.current_assets.total)}
                        </span>
                      </div>
                      {data.assets.current_assets.items.map((item, index, array) => (
                        <div
                          key={item.code}
                          className={`flex items-center justify-between gap-4 pl-4 ${index < array.length - 1 ? "pb-2 border-b surface-base-stroke" : ""}`}>
                          <span className="text-body-regular-sm content-base-secondary">
                            {item.code} {item.name}
                          </span>
                          <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                            {formatMoneyKzt(item.amount)}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                  {data.assets.fixed_assets.items.length > 0 && (
                    <>
                      <div className="flex items-center justify-between pt-2 border-t surface-base-stroke pb-2 border-b surface-base-stroke">
                        <span className="text-body-regular-sm content-base-secondary">
                          {data.assets.fixed_assets.title}
                        </span>
                        <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                          {formatMoneyKzt(data.assets.fixed_assets.total)}
                        </span>
                      </div>
                      {data.assets.fixed_assets.items.map((item, index, array) => (
                        <div
                          key={item.code}
                          className={`flex items-center justify-between pl-4 ${index < array.length - 1 ? "pb-2 border-b surface-base-stroke" : ""}`}>
                          <span className="text-body-regular-sm content-base-secondary">
                            {item.code} {item.name}
                          </span>
                          <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                            {formatMoneyKzt(item.amount)}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-body-semibold-md pt-3 border-t surface-base-stroke">
                <span className="text-body-regular-md content-action-neutral">
                  {t("balanceSheet.totalAssetsLabel")}
                </span>
                <span className="text-body-bold-lg content-action-positive whitespace-nowrap">
                  {formatMoneyKzt(data.assets.total)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border surface-base-stroke p-4 radius-md">
          <button
            onClick={() => setIsLiabilitiesOpen(!isLiabilitiesOpen)}
            className="w-full text-body-bold-lg content-base-primary text-center mb-4 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span>{t("balanceSheet.liabilitiesSection")}</span>
            <ArrowDown2
              size={16}
              color="currentColor"
              className={`transition-transform duration-200 ${isLiabilitiesOpen ? "" : "rotate-180"}`}
            />
          </button>
          {isLiabilitiesOpen && (
            <div className="flex flex-col gap-4">
              {data.liabilities.current_liabilities.items.length > 0 && (
                <div className="p-3 surface-component-fill radius-md">
                  <div className="flex flex-col gap-4 text-body-regular-sm">
                    {data.liabilities.current_liabilities.items.map((item, index, array) => (
                      <div
                        key={item.code}
                        className={`flex items-center justify-between gap-3 ${index < array.length - 1 ? "pb-2 border-b surface-base-stroke" : ""}`}>
                        <span className="text-body-regular-sm content-base-secondary">
                          {item.code} {item.name}
                        </span>
                        <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                          {formatMoneyKzt(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between text-body-semibold-md pt-3 border-t surface-base-stroke">
                <span className="text-body-regular-md content-action-neutral">
                  {t("balanceSheet.totalLiabilitiesLabel")}
                </span>
                <span className="text-body-bold-lg content-action-negative whitespace-nowrap">
                  {formatMoneyKzt(data.liabilities.total)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border surface-base-stroke p-4 radius-md">
          <button
            onClick={() => setIsEquityOpen(!isEquityOpen)}
            className="w-full text-body-bold-lg content-base-primary text-center mb-4 flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span>{t("balanceSheet.equitySection")}</span>
            <ArrowDown2
              size={16}
              color="currentColor"
              className={`transition-transform duration-200 ${isEquityOpen ? "" : "rotate-180"}`}
            />
          </button>
          {isEquityOpen && (
            <div className="flex flex-col gap-4">
              {data.equity.items.length > 0 && (
                <div className="p-3 surface-component-fill radius-md">
                  <div className="flex flex-col gap-4 text-body-regular-sm">
                    {data.equity.items.map((item, index, array) => (
                      <div
                        key={item.code}
                        className={`flex items-center justify-between gap-3 ${index < array.length - 1 ? "pb-2 border-b surface-base-stroke" : ""}`}>
                        <span className="text-body-regular-sm content-base-secondary">
                          {item.code} {item.name}
                        </span>
                        <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                          {formatMoneyKzt(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between text-body-semibold-md pt-3 border-t surface-base-stroke">
                <span className="text-body-regular-md content-action-neutral">
                  {t("balanceSheet.totalEquityLabel")}
                </span>
                <span className="text-body-bold-lg content-action-positive whitespace-nowrap">
                  {formatMoneyKzt(data.equity.total)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="flex justify-between text-body-semibold-md pt-3 border-t surface-base-stroke relative"
            onMouseEnter={() => setHoveredBalanceTooltip(true)}
            onMouseLeave={() => setHoveredBalanceTooltip(false)}>
            <Dropdown
              open={hoveredBalanceTooltip}
              onClose={() => setHoveredBalanceTooltip(false)}
              direction="bottom"
              align="left"
              width="w-80"
              className="elevation-level-2!">
              <span className="text-body-regular-md content-action-neutral flex items-center gap-1 cursor-pointer">
                <InfoCircle size={16} color="currentColor" /> {t("balanceSheet.passiveLabel")}:
              </span>
              <div
                className="p-3 flex flex-col gap-2 min-w-64"
                onMouseEnter={() => setHoveredBalanceTooltip(true)}
                onMouseLeave={() => setHoveredBalanceTooltip(false)}>
                <p className="text-body-regular-md content-action-neutral">{t("balanceSheet.balanceFormula")}</p>
                <div className="text-body-bold-md content-base-primary">
                  <span className="content-action-info">{t("balanceSheet.assetsSection")}</span> ={" "}
                  <span className="content-action-negative">{t("balanceSheet.liabilitiesSection")}</span> +{" "}
                  <span className="content-action-positive">{t("balanceSheet.equitySection")}</span>
                </div>
                <div className="text-body-bold-md content-base-primary">
                  {formatMoneyKzt(data.assets.total)} = {formatMoneyKzt(data.liabilities.total)} +{" "}
                  {formatMoneyKzt(data.equity.total)}
                </div>
              </div>
            </Dropdown>
            <span className="content-base-primary text-body-bold-lg">
              {formatMoneyKzt(data.total_liabilities_and_equity)}
            </span>
          </div>

          {data.is_balanced ? (
            <Badge text={t("balanceSheet.balanceStatusFormula")} variant="soft" color="positive" />
          ) : (
            <Badge text={t("balanceSheet.balanceStatusUnbalanced")} variant="soft" color="negative" />
          )}
        </div>
      </div>
    </div>
  );
}
