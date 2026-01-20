import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Box1, DocumentText1, Archive, Profile2User, Calculator, InfoCircle } from "iconsax-react";
import { ModalForm, Skeleton, Badge, Button, Toast, Dropdown } from "@/shared/ui";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { useScrollDetection } from "@/shared/hooks";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import { useGetWarehouseUnitDetailQuery } from "../../../api";
import { getWarehouseAvailableActions, getWarehouseStatusConfig, formatWarehouseDate, toPercent } from "../../../utils";

interface Props {
  itemId: number;
  onClose: () => void;
  onAssign?: (id: number) => void;
  onReturn?: (id: number) => void;
  onWriteOff?: (id: number) => void;
  assigningId?: number | null;
  writingOffId?: number | null;
}

export default function ItemDetailsModal({
  itemId,
  onClose,
  onAssign,
  onReturn,
  onWriteOff,
  assigningId,
  writingOffId,
}: Props) {
  const { t, i18n } = useTranslation("WarehousePage");
  const _locale = (i18n.language as "ru" | "en" | "kk") || "ru";
  const { data: unit, isLoading, isError } = useGetWarehouseUnitDetailQuery(itemId);
  const { scrollRef: mainScrollRef, hasScroll: mainHasScroll } = useScrollDetection();
  const { scrollRef: loadingScrollRef, hasScroll: loadingHasScroll } = useScrollDetection();
  const { scrollRef: errorScrollRef, hasScroll: errorHasScroll } = useScrollDetection();
  const [hoveredDepreciationId, setHoveredDepreciationId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <ModalForm icon={Box1} onClose={onClose}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <Skeleton width={200} height={24} />
          </div>
          <div
            ref={loadingScrollRef}
            className={cn("flex-1 overflow-auto min-h-0 p-1 page-scroll", loadingHasScroll && "pr-3")}>
            <div className="flex flex-col py-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className={cn("py-3", idx < 4 && "border-b surface-base-stroke")}>
                  <Skeleton height={20} width="100%" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalForm>
    );
  }

  if (isError || !unit) {
    return (
      <ModalForm icon={Box1} onClose={onClose}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("detailsModal.title")}</h4>
          </div>
          <div
            ref={errorScrollRef}
            className={cn(
              "flex-1 overflow-auto min-h-0 flex items-center justify-center page-scroll",
              errorHasScroll && "pr-3",
            )}>
            <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>
          </div>
        </div>
      </ModalForm>
    );
  }

  const assetTypeLabel = t(`assetType.${unit.asset_type}`) || unit.asset_type;
  const statusLabel = t(`status.${unit.status}`) || unit.status_display;
  const statusConfig = getWarehouseStatusConfig(unit.status);
  const availableActions = getWarehouseAvailableActions(unit.asset_type, unit.status);
  const actionsWithoutOpen = availableActions.filter((action) => action !== "open");

  const isAssigning = assigningId === itemId;
  const isWritingOff = writingOffId === itemId;

  const fields = [
    {
      key: "status",
      label: t("detailsModal.status"),
      value: statusLabel,
      icon: Archive,
      isStatus: true,
    },
    {
      key: "barcode",
      label: t("detailsModal.barcode"),
      value: unit.barcode,
      icon: DocumentText1,
    },
    {
      key: "serialNumber",
      label: t("detailsModal.serialNumber"),
      value: unit.serial_number,
      icon: Box1,
    },
    ...(unit.assigned_to_name
      ? [
          {
            key: "assignedTo",
            label: t("detailsModal.assignedTo"),
            value: `${unit.assigned_to_name}${unit.assigned_date ? ` (${formatWarehouseDate(unit.assigned_date)})` : ""}`,
            icon: Profile2User,
          },
        ]
      : []),
  ].filter((field) => field.value || field.isStatus);

  return (
    <ModalForm icon={Box1} onClose={onClose} resize={false}>
      <div className="flex flex-col gap-5 h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
          <h4 className="text-display-2xs content-base-primary">{unit.item_name}</h4>
          <Badge variant="soft" color="gray" text={assetTypeLabel} />
        </div>

        <div
          ref={mainScrollRef}
          className={cn("flex-1 overflow-auto min-h-0 p-1 page-scroll", mainHasScroll && "pr-5")}>
          <div className="flex flex-col">
            {fields.map((field, index, array) => {
              const IconComponent = field.icon;
              return (
                <div
                  key={field.key}
                  className={cn(
                    "py-3 flex items-center gap-3",
                    index < array.length - 1 && "border-b surface-base-stroke",
                  )}>
                  <span className="content-action-brand">
                    <IconComponent size={16} color="currentColor" />
                  </span>
                  <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">
                    {field.label}
                  </span>
                  {field.isStatus ? (
                    <div className="flex justify-end">
                      <Badge variant="soft" color={statusConfig.color} text={field.value} icon={statusConfig.icon} />
                    </div>
                  ) : (
                    <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                  )}
                </div>
              );
            })}

            <div className="mt-4 p-5 radius-lg border surface-component-stroke flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b surface-base-stroke">
                <div className="w-8 aspect-square surface-component-fill radius-xs flex items-center justify-center">
                  <span className="content-action-neutral">
                    <TengeCircleIcon size={16} className="dark:text-grey-400" />
                  </span>
                </div>
                <h5 className="text-body-bold-md content-base-primary">{t("detailsModal.cost")}</h5>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-body-regular-md content-base-secondary">{t("detailsModal.unitCost")}:</span>
                  <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(unit.unit_cost)}</span>
                </div>
              </div>
            </div>

            {unit.is_depreciable && (
              <div className="mt-4 p-5 radius-lg border surface-component-stroke flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b surface-base-stroke">
                  <div className="w-8 aspect-square surface-component-fill radius-xs flex items-center justify-center">
                    <span className="content-action-neutral">
                      <Calculator size={16} color="currentColor" />
                    </span>
                  </div>
                  <h5 className="text-body-bold-md content-base-primary">{t("detailsModal.depreciation")}</h5>
                </div>
                <div className="flex flex-col gap-3">
                  {unit.depreciation_rate && (
                    <div className="flex justify-between items-center">
                      <span className="text-body-regular-md content-base-secondary">
                        {t("detailsModal.annualRate")}:
                      </span>
                      <span className="text-body-bold-md content-base-primary">
                        {toPercent(toNumber(unit.depreciation_rate))}%
                      </span>
                    </div>
                  )}
                  {unit.monthly_depreciation_amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-body-regular-md content-base-secondary">
                        {t("detailsModal.monthlyDepreciation")}:
                      </span>
                      <span className="text-body-bold-md content-base-primary">
                        {formatMoneyKzt(unit.monthly_depreciation_amount)}
                      </span>
                    </div>
                  )}
                  {unit.accumulated_depreciation && toNumber(unit.accumulated_depreciation) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-body-regular-md content-base-secondary">
                        {t("detailsModal.accumulatedDepreciation")}:
                      </span>
                      <span className="text-body-bold-md content-action-negative">
                        {formatMoneyKzt(unit.accumulated_depreciation)}
                      </span>
                    </div>
                  )}
                  {unit.next_depreciation_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-body-regular-md content-base-secondary">
                        {t("detailsModal.nextDepreciationDate")}:
                      </span>
                      <span className="text-body-bold-md content-base-primary">
                        {formatWarehouseDate(unit.next_depreciation_date)}
                      </span>
                    </div>
                  )}
                  {unit.months_until_fully_depreciated > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b surface-base-stroke">
                      <span className="text-body-regular-md content-base-secondary">
                        {t("detailsModal.monthsRemaining")}:
                      </span>
                      <span className="text-body-bold-md content-base-primary">
                        {unit.months_until_fully_depreciated}
                      </span>
                    </div>
                  )}
                  {unit.residual_value && (
                    <div className="flex justify-between items-center p-4 surface-component-fill radius-xs mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-body-regular-md content-base-primary font-medium">
                          {t("detailsModal.residualValue")}:
                        </span>
                        {unit.accumulated_depreciation && toNumber(unit.accumulated_depreciation) > 0 && (
                          <div
                            className="relative flex items-center"
                            onMouseEnter={() => setHoveredDepreciationId(itemId)}
                            onMouseLeave={() => setHoveredDepreciationId(null)}>
                            <Dropdown
                              open={hoveredDepreciationId === itemId}
                              onClose={() => setHoveredDepreciationId(null)}
                              direction="bottom"
                              align="right"
                              width="w-max"
                              className="elevation-level-2!">
                              <InfoCircle
                                size={14}
                                color="currentColor"
                                className="content-action-neutral cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <div
                                className="p-3 flex flex-col gap-1 min-w-48"
                                onMouseEnter={() => setHoveredDepreciationId(itemId)}
                                onMouseLeave={() => setHoveredDepreciationId(null)}>
                                <div className="flex justify-between gap-4 text-label-xs">
                                  <span className="content-action-neutral">{t("tooltip.originalCost")}:</span>
                                  <span className="content-base-primary">{formatMoneyKzt(unit.unit_cost)}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-label-xs">
                                  <span className="content-action-neutral">{t("tooltip.accumulated")}:</span>
                                  <span className="content-action-negative">
                                    {formatMoneyKzt(unit.accumulated_depreciation)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 text-label-xs">
                                  <span className="content-action-neutral">{t("tooltip.residualValue")}:</span>
                                  <span className="content-action-positive">{formatMoneyKzt(unit.residual_value)}</span>
                                </div>
                                {unit.next_depreciation_date && (
                                  <div className="flex justify-between gap-4 text-label-xs pt-1 border-t surface-base-stroke">
                                    <span className="content-action-neutral">{t("tooltip.nextDepreciation")}:</span>
                                    <span className="content-base-primary">
                                      {formatWarehouseDate(unit.next_depreciation_date)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Dropdown>
                          </div>
                        )}
                      </div>
                      <span className="text-body-bold-lg content-base-primary">
                        {formatMoneyKzt(unit.residual_value)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {actionsWithoutOpen.length > 0 && (
          <div className="flex flex-col gap-2 pt-4 border-t surface-base-stroke p-1 shrink-0">
            {unit.is_depreciable && (
              <Toast color="grey" text={t("detailsModal.depreciationAutoNote")} closable={false} autoClose={false} />
            )}
            {availableActions.includes("assign") && onAssign && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={isAssigning}
                onClick={() => onAssign(itemId)}>
                {isAssigning ? t("loading") : t("actions.assign")}
              </Button>
            )}
            {availableActions.includes("return") && onReturn && (
              <Button variant="secondary" size="md" className="w-full" onClick={() => onReturn(itemId)}>
                {t("actions.return")}
              </Button>
            )}
            {availableActions.includes("writeOff") && onWriteOff && (
              <Button
                variant="danger"
                size="md"
                className="w-full"
                disabled={isWritingOff}
                onClick={() => onWriteOff(itemId)}>
                {isWritingOff ? t("loading") : t("actions.writeOff")}
              </Button>
            )}
          </div>
        )}
      </div>
    </ModalForm>
  );
}
