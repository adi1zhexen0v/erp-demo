import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, Clock, Chart2 } from "iconsax-react";
import type { DepreciationReport, DepreciationAsset, DepreciationSummary } from "@/features/accounting/reports/types";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import { Badge, Skeleton, Table } from "@/shared/ui";
import { usePagination } from "@/shared/hooks";
import Pagination from "@/shared/components/Pagination";
import { useGetWarehouseItemsQuery, useGetWarehouseUnitsQuery } from "@/features/accounting/warehouse";
import type { TransactionStatus } from "@/features/accounting/warehouse/types";

interface DepreciationReportCardProps {
  data?: DepreciationReport;
  isLoading?: boolean;
  error?: unknown;
}

export default function DepreciationReportCard({ data, isLoading, error }: DepreciationReportCardProps) {
  const { t } = useTranslation("ReportsPage");

  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: itemsData, isLoading: isLoadingItems } = useGetWarehouseItemsQuery();
  const { data: unitsData, isLoading: isLoadingUnits } = useGetWarehouseUnitsQuery();

  const itemStatusMap = useMemo(() => {
    if (!itemsData || !Array.isArray(itemsData)) return new Map<string, TransactionStatus>();
    const map = new Map<string, TransactionStatus>();
    itemsData.forEach((item) => {
      const key = `${item.name}|${item.vendor_name}`;
      map.set(key, item.transaction_status);
    });
    return map;
  }, [itemsData]);

  const filteredUnits = useMemo(() => {
    if (!unitsData || !Array.isArray(unitsData)) return [];
    if (isLoadingItems) return [];
    if (!itemsData || itemStatusMap.size === 0) return [];

    return unitsData.filter((unit) => {
      const vendorName = unit.vendor?.name || "";
      const key = `${unit.item_name}|${vendorName}`;
      const transactionStatus = itemStatusMap.get(key);

      if (transactionStatus === undefined) {
        return false;
      }

      return transactionStatus !== "draft";
    });
  }, [unitsData, itemStatusMap, isLoadingItems, itemsData]);

  const filteredUnitsMap = useMemo(() => {
    const map = new Map<number, boolean>();
    filteredUnits.forEach((unit) => {
      map.set(unit.id, true);
    });
    return map;
  }, [filteredUnits]);

  const filteredAssets = useMemo(() => {
    if (!data?.assets) return [];
    return data.assets.filter((asset) => filteredUnitsMap.has(asset.unit_id));
  }, [data?.assets, filteredUnitsMap]);

  const recalculatedSummary = useMemo((): DepreciationSummary | undefined => {
    if (!data?.summary) return undefined;

    const totalInitialCost = filteredAssets.reduce((sum, asset) => sum + toNumber(asset.initial_cost), 0);
    const totalResidualValue = filteredAssets.reduce((sum, asset) => sum + toNumber(asset.residual_value), 0);
    const totalMonthlyDepreciation = filteredAssets.reduce(
      (sum, asset) => sum + toNumber(asset.monthly_depreciation),
      0,
    );
    const totalAccumulatedDepreciation = filteredAssets.reduce(
      (sum, asset) => sum + toNumber(asset.accumulated_depreciation),
      0,
    );

    return {
      ...data.summary,
      total_assets_count: filteredAssets.length,
      total_initial_cost: totalInitialCost.toFixed(2),
      total_residual_value: totalResidualValue.toFixed(2),
      total_monthly_depreciation: totalMonthlyDepreciation.toFixed(2),
      total_accumulated_depreciation: totalAccumulatedDepreciation.toFixed(2),
    };
  }, [data?.summary, filteredAssets]);

  const combinedIsLoading = isLoading || isLoadingItems || isLoadingUnits;

  const pagination = usePagination(filteredAssets.length, 10, [filteredAssets]);

  if (combinedIsLoading) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
          <Skeleton width={32} height={32} circle />
          <Skeleton width={300} height={24} />
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-6">
          <Skeleton width="100%" height={200} />
          <Skeleton width="100%" height={400} />
        </div>
      </div>
    );
  }

  if (error || !data || !recalculatedSummary) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b surface-base-stroke">
          <div className="flex items-center gap-3">
            <div className="w-10 aspect-square flex items-center justify-center background-brand-fill radius-xs">
              <Clock size={20} color="white" />
            </div>
            <div>
              <h3 className="text-body-semibold-lg content-base-primary">{t("depreciationReport.title")}</h3>
              <p className="text-body-regular-sm content-base-secondary">{t("depreciationReport.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <ArrowDown2
              size={16}
              color="currentColor"
              className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {!isCollapsed && (
          <div className="text-body-regular-md content-action-neutral">
            {error ? t("depreciationReport.error") : t("depreciationReport.noData")}
          </div>
        )}
      </div>
    );
  }

  const paginatedAssets = filteredAssets.slice(pagination.startIndex, pagination.endIndex);

  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b surface-base-stroke">
        <div className="flex items-center gap-3">
          <div className="w-8 aspect-square flex items-center justify-center surface-component-fill radius-xs">
            <Chart2 size={16} color="currentColor" />
          </div>
          <h3 className="text-body-bold-lg content-base-primary">{t("depreciationReport.title")}</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <ArrowDown2
            size={16}
            color="currentColor"
            className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-[1fr_3fr] gap-10">
          <div className="flex flex-col gap-4">
            <h4 className="text-body-bold-lg content-base-primary">{t("depreciationReport.summary.title")}</h4>
            <div className="flex flex-col gap-4 text-body-regular-sm p-4 surface-component-fill radius-lg">
              <div className="flex items-center justify-between gap-3 pb-2 border-b surface-base-stroke">
                <span className="text-body-regular-sm content-base-secondary">
                  {t("depreciationReport.summary.assetsCount")}
                </span>
                <span className="content-base-primary text-body-bold-lg">{recalculatedSummary.total_assets_count}</span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2 border-b surface-base-stroke">
                <span className="text-body-regular-sm content-base-secondary">
                  {t("depreciationReport.summary.initialCost")}
                </span>
                <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                  {formatMoneyKzt(recalculatedSummary.total_initial_cost)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2 border-b surface-base-stroke">
                <span className="text-body-regular-sm content-base-secondary">
                  {t("depreciationReport.summary.accumulatedDepreciation")}
                </span>
                <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                  {recalculatedSummary.total_accumulated_depreciation !== "0.00"
                    ? formatMoneyKzt(recalculatedSummary.total_accumulated_depreciation)
                    : formatMoneyKzt(
                        toNumber(recalculatedSummary.total_initial_cost) -
                          toNumber(recalculatedSummary.total_residual_value)
                      )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2 border-b surface-base-stroke">
                <span className="text-body-regular-sm content-base-secondary">
                  {t("depreciationReport.summary.residualValue")}
                </span>
                <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                  {formatMoneyKzt(recalculatedSummary.total_residual_value)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-regular-sm content-base-secondary">
                  {t("depreciationReport.summary.monthlyDepreciation")}
                </span>
                <span className="content-base-primary text-body-bold-lg whitespace-nowrap">
                  {formatMoneyKzt(recalculatedSummary.total_monthly_depreciation)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-body-bold-lg content-base-primary">{t("depreciationReport.assets.title")}</h4>
            {filteredAssets.length === 0 ? (
              <div className="text-body-regular-md content-action-neutral">{t("depreciationReport.noData")}</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table.Table>
                    <Table.Header>
                      <tr>
                        <Table.HeadCell>{t("depreciationReport.assets.name")}</Table.HeadCell>
                        <Table.HeadCell>{t("depreciationReport.assets.type")}</Table.HeadCell>
                        <Table.HeadCell>{t("depreciationReport.assets.rate")}</Table.HeadCell>
                        <Table.HeadCell align="right">{t("depreciationReport.assets.initialCost")}</Table.HeadCell>
                        <Table.HeadCell align="right">{t("depreciationReport.assets.residualValue")}</Table.HeadCell>
                        <Table.HeadCell align="right">
                          {t("depreciationReport.assets.monthlyDepreciation")}
                        </Table.HeadCell>
                      </tr>
                    </Table.Header>
                    <Table.Body>
                      {paginatedAssets.map((asset: DepreciationAsset) => {
                        const isFullyDepreciated = asset.is_fully_depreciated;
                        return (
                          <Table.Row
                            key={`${asset.id}-${asset.unit_id}`}
                            className={isFullyDepreciated ? "opacity-60" : ""}>
                            <Table.Cell>
                              <div className="flex flex-col gap-0.5">
                                <span className="content-base-primary">{asset.name}</span>
                                {isFullyDepreciated && (
                                  <span className="text-body-regular-xs content-action-neutral">
                                    {t("depreciationReport.assets.fullyDepreciated")}
                                  </span>
                                )}
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <Badge variant="soft" color="info" text={asset.asset_type_display} />
                            </Table.Cell>
                            <Table.Cell>{asset.depreciation_rate_display}</Table.Cell>
                            <Table.Cell align="right">{formatMoneyKzt(asset.initial_cost)}</Table.Cell>
                            <Table.Cell align="right">{formatMoneyKzt(asset.residual_value)}</Table.Cell>
                            <Table.Cell align="right">{formatMoneyKzt(asset.monthly_depreciation)}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Table>
                </div>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  total={filteredAssets.length}
                  fromItem={pagination.fromItem}
                  toItem={pagination.toItem}
                  onPageChange={pagination.setPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
