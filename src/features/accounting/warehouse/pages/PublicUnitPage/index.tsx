import { useRef, useEffect } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Chart1, Buildings, Profile, Box1 } from "iconsax-react";
import { Loader, TabsWithScroll } from "@/shared/components";
import { useScrollDetection } from "@/shared/hooks";
import { formatDateForDisplay, toNumber } from "@/shared/utils";
import { Badge } from "@/shared/ui";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { useGetPublicUnitInfoQuery } from "../../api";
import { extractVatAmount, toVatPercent, toPercent, getPassedMonths, getUsefulLifeTotal } from "../../utils";

export default function PublicUnitPage() {
  const { barcode } = useParams<{ barcode: string }>();
  const { t } = useTranslation("WarehousePage");

  const {
    data: unit,
    isLoading,
    isError,
    error,
  } = useGetPublicUnitInfoQuery(barcode || "", {
    skip: !barcode,
  });

  const { scrollRef, hasScroll } = useScrollDetection();

  const costRef = useRef<HTMLDivElement>(null);
  const depreciationRef = useRef<HTMLDivElement>(null);
  const vendorRef = useRef<HTMLDivElement>(null);
  const responsibleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (unit?.item_name) {
      document.title = `${unit.item_name} ${t("publicUnit.pageTitleWithBrand")}`;
    }
  }, [unit?.item_name, t]);

  const tabs = [
    {
      id: "cost",
      label: t("publicUnit.cost"),
      ref: costRef as React.RefObject<HTMLDivElement>,
      icon: <TengeCircleIcon size={16} className="dark:text-grey-400" />,
    },
    {
      id: "depreciation",
      label: t("publicUnit.depreciation"),
      ref: depreciationRef as React.RefObject<HTMLDivElement>,
      icon: <Chart1 size={16} color="currentColor" />,
    },
    {
      id: "vendor",
      label: t("publicUnit.vendor"),
      ref: vendorRef as React.RefObject<HTMLDivElement>,
      icon: <Buildings size={16} color="currentColor" />,
    },
    {
      id: "responsible",
      label: t("publicUnit.responsiblePerson"),
      ref: responsibleRef as React.RefObject<HTMLDivElement>,
      icon: <Profile size={16} color="currentColor" />,
    },
  ];

  if (!barcode) {
    return (
      <div className="max-w-3xl mx-auto my-16 px-4">
        <h1 className="text-display-xs content-base-primary mb-4">{t("messages.errorTitle")}</h1>
        <p className="text-body-md content-base-secondary">{t("publicUnit.noBarcode")}</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loader isFullPage />;
  }

  if (isError || !unit) {
    const is404 = (error as any)?.status === 404 || (error as any)?.data?.error;
    return (
      <div className="max-w-3xl mx-auto my-16 px-4">
        <h1 className="text-display-xs content-base-primary mb-4">
          {is404 ? t("publicUnit.notFound") : t("messages.errorTitle")}
        </h1>
        <p className="text-body-md content-base-secondary">
          {is404
            ? t("publicUnit.notFoundDescription")
            : (error as any)?.data?.error || t("publicUnit.errorDescription")}
        </p>
      </div>
    );
  }

  const assetTypeLabel = t(`assetType.${unit.asset_type}`) || unit.asset_type_display;
  const statusLabel = t(`status.${unit.status}`) || unit.status_display;

  const unitCost = toNumber(unit.unit_cost);
  const vatRate = 0.16;
  const vatAmount = extractVatAmount(unitCost, vatRate);

  const depreciationRate = toNumber(unit.depreciation_rate);
  const annualRatePercent = depreciationRate > 0 ? toPercent(depreciationRate) : null;
  const monthlyDepreciation = toNumber(unit.monthly_depreciation_amount);
  const accumulatedDepreciation = toNumber(unit.accumulated_depreciation);
  const passedMonths = getPassedMonths(accumulatedDepreciation, monthlyDepreciation);
  const usefulLifeMonths = getUsefulLifeTotal(unit.months_until_fully_depreciated, passedMonths);

  return (
    <div className="max-w-3xl mx-4 md:mx-auto mt-8 mb-0 p-7 surface-base-fill radius-lg">
      <div className="flex flex-col gap-7">
        <header className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <div className="flex flex-col sm:flex-rowitems-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-11 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
                <Box1 size={20} color="currentColor" variant="Bold" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-heading-lg content-base-primary">{unit.item_name}</h1>
                <p className="text-body-regular-xs content-action-neutral">{assetTypeLabel}</p>
              </div>
            </div>
            {statusLabel && <Badge variant="soft" color="gray" text={statusLabel} />}
          </div>
        </header>

        <TabsWithScroll items={tabs} />

        <div ref={scrollRef} className={cn("flex-1 page-scroll", hasScroll && "pr-5")}>
          <div className="flex flex-col gap-7">
            <div ref={costRef} className="p-5 border surface-base-stroke radius-lg flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 aspect-square surface-info-subtle radius-xs flex items-center justify-center">
                  <TengeCircleIcon size={16} className="dark:text-grey-400" />
                </div>
                <h6 className="text-body-bold-lg content-base-primary">{t("publicUnit.cost")}</h6>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-start gap-3 pb-3 border-b surface-base-stroke">
                  <span className="text-label-xs content-action-neutral">{t("publicUnit.unitPrice")}:</span>
                  <p className="text-body-bold-md content-base-primary text-right">
                    {formatMoneyKzt(unit.unit_cost)}
                  </p>
                </div>
                {(unit as any).quantity && (
                  <div className="flex justify-between items-start gap-3 pt-3 border-b surface-base-stroke pb-3">
                    <span className="text-label-xs content-action-neutral">{t("publicUnit.quantity")}:</span>
                    <p className="text-body-bold-md content-base-primary text-right">
                      {(unit as any).quantity} {(unit as any).unit ? (unit as any).unit : t("publicUnit.unit")}
                    </p>
                  </div>
                )}
                {vatAmount > 0 && (
                  <>
                    <div className="pt-3 flex justify-between items-start gap-3">
                      <span className="text-label-xs content-action-neutral">
                        {t("publicUnit.vat")} ({toVatPercent(vatRate)}%):
                      </span>
                      <p className="text-body-bold-md content-base-primary text-right">
                        {formatMoneyKzt(Math.round(vatAmount))}
                      </p>
                    </div>
                  </>
                )}
                {vatAmount === 0 && (
                  <div className="py-3 flex justify-between items-start gap-3">
                    <span className="text-body-regular-md content-base-primary font-medium">
                      {t("publicUnit.totalWithDelivery")}:
                    </span>
                    <p className="text-body-bold-lg content-base-primary text-right">
                      {formatMoneyKzt(unit.unit_cost)}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-3 flex justify-between items-center gap-3 surface-component-fill radius-xs">
                <span className="text-body-regular-sm content-base-primary">{t("publicUnit.totalWithDelivery")}:</span>
                <p className="text-display-2xs content-base-primary text-nowrap">
                  {formatMoneyKzt(unit.unit_cost)}
                </p>
              </div>
            </div>

            {unit.is_depreciable && (
              <div ref={depreciationRef} className="p-5 border surface-base-stroke radius-lg flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 aspect-square surface-info-subtle radius-xs flex items-center justify-center">
                    <Chart1 size={16} color="currentColor" />
                  </div>
                  <h6 className="text-body-bold-lg content-base-primary">{t("publicUnit.depreciation")}</h6>
                </div>

                <div className="flex flex-col">
                  {depreciationRate > 0 && (
                    <div className="flex justify-between items-start gap-3 pb-3 border-b surface-base-stroke">
                      <span className="text-label-xs content-action-neutral">{t("publicUnit.annualRate")}:</span>
                      <p className="text-body-bold-md content-base-primary text-right">{annualRatePercent}%</p>
                    </div>
                  )}
                  {usefulLifeMonths && (
                    <div className="flex justify-between items-start gap-3 pb-3 border-b surface-base-stroke pt-3">
                      <span className="text-label-xs content-action-neutral">{t("publicUnit.usefulLife")}:</span>
                      <p className="text-body-bold-md content-base-primary text-right">
                        {usefulLifeMonths} {t("publicUnit.months")}
                      </p>
                    </div>
                  )}
                  {unit.accumulated_depreciation && (
                    <div className="flex justify-between items-start gap-3 pt-3">
                      <span className="text-label-xs content-action-neutral">
                        {t("publicUnit.accumulatedDepreciation")}:
                      </span>
                      <p className="text-body-bold-md content-base-primary text-right">
                        {formatMoneyKzt(unit.accumulated_depreciation)}
                      </p>
                    </div>
                  )}
                </div>
                {unit.residual_value && (
                  <div className="p-3 flex justify-between items-center gap-3 surface-component-fill radius-xs">
                    <span className="text-body-regular-sm content-base-primary">{t("publicUnit.residualValue")}:</span>
                    <p className="text-display-2xs content-base-primary text-nowrap">
                      {formatMoneyKzt(unit.residual_value)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {unit.vendor && (
              <div ref={vendorRef} className="p-5 border surface-base-stroke radius-lg flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 aspect-square surface-info-subtle radius-xs flex items-center justify-center">
                    <Buildings size={16} color="currentColor" />
                  </div>
                  <h6 className="text-body-bold-lg content-base-primary">{t("publicUnit.vendor")}</h6>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-start gap-3 pb-3 border-b surface-base-stroke">
                    <span className="text-label-xs content-action-neutral">{t("publicUnit.vendorName")}:</span>
                    <p className="text-body-bold-md content-base-primary text-right">{unit.vendor.name}</p>
                  </div>
                  {(unit as any).invoice_number && (
                    <div className="flex justify-between items-start gap-3 pt-3 border-b surface-base-stroke pb-3">
                      <span className="text-label-xs content-action-neutral">{t("publicUnit.invoiceNumber")}:</span>
                      <p className="text-body-bold-md content-base-primary text-right">
                        {(unit as any).invoice_number}
                      </p>
                    </div>
                  )}
                  {(unit as any).account_code && (
                    <div className="flex justify-between items-start gap-3 pt-3 border-b surface-base-stroke pb-3">
                      <span className="text-label-xs content-action-neutral">{t("publicUnit.accountCode")}:</span>
                      <p className="text-body-bold-md content-base-primary text-right">{(unit as any).account_code}</p>
                    </div>
                  )}
                  {unit.vendor.bin && (
                    <div className="flex justify-between items-start gap-3 pt-3 border-b surface-base-stroke pb-3">
                      <span className="text-label-xs content-action-neutral">{t("publicUnit.vendorBin")}:</span>
                      <p className="text-body-bold-md content-base-primary text-right">{unit.vendor.bin}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-start gap-3 pt-3">
                    <span className="text-label-xs content-action-neutral">{t("publicUnit.receiptDate")}:</span>
                    <p className="text-body-bold-md content-base-primary text-right">
                      {formatDateForDisplay(unit.created_at, false)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={responsibleRef} className="p-5 border surface-base-stroke radius-lg flex flex-col gap-5">
              <div className="flex items-start gap-2">
                <div className="w-8 aspect-square surface-info-subtle radius-xs flex items-center justify-center">
                  <Profile size={16} color="currentColor" />
                </div>
                <div className="flex flex-col">
                  <h6 className="text-body-bold-lg content-base-primary">{t("publicUnit.responsiblePerson")}</h6>
                  {unit.assigned_date && (
                    <span className="text-body-regular-xs content-action-neutral">
                      {formatDateForDisplay(unit.assigned_date, false)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                {unit.assigned_to_name ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 aspect-square rounded-full flex items-center justify-center background-brand-subtle overflow-hidden">
                      <span className="text-black text-sm font-bold">
                        {unit.assigned_to_name
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-body-bold-md content-base-primary">{unit.assigned_to_name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-3 pb-3 border-b surface-base-stroke">
                    <span className="text-label-xs content-action-neutral">{t("publicUnit.notAssigned")}</span>
                    <p className="text-body-regular-md content-action-neutral text-right">—</p>
                  </div>
                )}
              </div>
              {unit.assigned_to_name && unit.assignment_document && (
                <div className="flex justify-between items-start gap-3 border-t surface-base-stroke pt-3">
                  <span className="text-label-xs content-action-neutral">{t("publicUnit.assignmentDocument")}:</span>
                  <p className="text-body-bold-md content-base-primary text-right">{unit.assignment_document}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
