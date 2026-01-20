import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import type { GroupedPurchase } from "../../../types";
import { CATEGORY_LABELS } from "../../../consts";
import { assetTypeToCategory } from "../../../types";
import { calculateNetAmount, calculateVatAmount, DEFAULT_VAT_RATE } from "../../../utils";

interface Props {
  purchase: GroupedPurchase;
  isFullScreen: boolean;
}

interface ItemCalculation {
  item: GroupedPurchase["items"][0];
  netAmount: number;
  vatAmount: number;
  total: number;
  category: string;
  categoryLabel: string;
}

export default function PurchaseCalculationSection({ purchase, isFullScreen }: Props) {
  const { t, i18n } = useTranslation("PurchasesPage");
  const locale = (i18n.language as "ru" | "en" | "kk") || "ru";

  const vatRate = DEFAULT_VAT_RATE;

  const itemsCalculations = useMemo<ItemCalculation[]>(() => {
    return purchase.items.map((item) => {
      const total = toNumber(item.total_with_delivery);
      const netAmount = calculateNetAmount(total, vatRate);
      const vatAmount = calculateVatAmount(total, vatRate);
      const category = assetTypeToCategory(item.asset_type);
      const categoryLabel = CATEGORY_LABELS[category]?.[locale] || item.asset_type_display;

      return {
        item,
        netAmount,
        vatAmount,
        total,
        category,
        categoryLabel,
      };
    });
  }, [purchase.items, vatRate, locale]);

  const subtotal = itemsCalculations.reduce((sum, calc) => sum + calc.total, 0);
  const totalNetAmount = itemsCalculations.reduce((sum, calc) => sum + calc.netAmount, 0);
  const totalVatAmount = itemsCalculations.reduce((sum, calc) => sum + calc.vatAmount, 0);

  return (
    <div className={`grid gap-3 p-1 ${isFullScreen ? "grid-cols-2" : "grid-cols-1"}`}>
      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            1
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("detail.calculation.title")}</span>
        </div>

        <div className="pt-3 border-t surface-base-stroke">
          <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-label-xs content-action-neutral">×</span>
              <span className="text-body-regular-sm content-base-primary">
                {t("detail.calculation.vatCalculation")} — {Math.round(vatRate * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                {formatMoneyKzt(totalNetAmount)} × {vatRate}
              </span>
              <p className="text-body-bold-md content-base-primary">= {formatMoneyKzt(totalVatAmount)}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 surface-component-fill radius-sm p-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-label-xs content-action-neutral">+</span>
            <span className="text-body-regular-sm content-base-primary">{t("detail.calculation.totalToPay")}</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-3 border-t border-b surface-base-stroke">
            <div className="py-1 px-2 rounded-4xl text-label-sm surface-info-subtle background-on-background-strong-info">
              {t("detail.calculation.netLabel")}
            </div>
            <span className="text-body-bold-lg content-base-primary">+</span>
            <div className="py-1 px-2 rounded-4xl text-label-sm surface-negative-subtle background-on-background-strong-negative">
              {t("detail.calculation.vatLabel")}
            </div>
            <span className="text-body-bold-lg content-base-primary">=</span>
            <div className="py-1 px-2 rounded-4xl text-label-sm surface-positive-subtle background-on-background-strong-positive">
              {t("detail.calculation.totalLabel")}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {formatMoneyKzt(totalNetAmount)} + {formatMoneyKzt(totalVatAmount)}
            </span>
            <p className="text-body-bold-md content-action-positive">= {formatMoneyKzt(subtotal)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <h5 className="text-display-lg content-action-positive">{formatMoneyKzt(subtotal)}</h5>
          <span className="text-label-xs content-action-neutral">{t("detail.calculation.amountToSupplier")}</span>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            2
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("detail.calculation.journalEntries")}</span>
        </div>

        <div className="flex flex-col gap-6">
          {itemsCalculations.map((calc, index) => (
            <div key={calc.item.id} className="flex flex-col gap-3 border-b surface-base-stroke pb-6">
              <p className="text-label-md content-base-primary font-semibold">
                {t("detail.calculation.itemLabel")} {index + 1}: {calc.item.name} ({calc.item.asset_type_display})
              </p>

              <div className="p-3 radius-sm surface-component-fill">
                <p className="text-label-md content-base-primary mb-2 pb-2 border-b surface-base-stroke text-center">
                  {t("detail.calculation.entry1Title")}
                </p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-label-sm content-base-primary mb-1">{t("detail.calculation.debit")}</p>
                    <p className="text-body-bold-md content-action-positive">
                      {calc.category} - {calc.categoryLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-label-sm content-base-primary mb-1">{t("detail.calculation.credit")}</p>
                    <p className="text-body-bold-md content-action-positive">
                      3310 - {t("detail.calculation.payables")}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t surface-base-stroke text-center">
                  <p className="text-display-2xs content-base-primary">{formatMoneyKzt(calc.netAmount)}</p>
                </div>
              </div>

              <div className="p-3 radius-sm surface-component-fill">
                <p className="text-label-md content-base-primary mb-2 pb-2 border-b surface-base-stroke text-center">
                  {t("detail.calculation.entry2Title")}
                </p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-label-sm content-base-primary mb-1">{t("detail.calculation.debit")}</p>
                    <p className="text-body-bold-md content-action-positive">
                      1420 - {t("detail.calculation.vatReceivable")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-label-sm content-base-primary mb-1">{t("detail.calculation.credit")}</p>
                    <p className="text-body-bold-md content-action-positive">
                      3310 - {t("detail.calculation.payables")}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t surface-base-stroke text-center">
                  <p className="text-display-2xs content-base-primary">{formatMoneyKzt(calc.vatAmount)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="surface-component-fill radius-sm p-3">
            <p className="text-label-sm content-action-neutral mb-1">{t("detail.calculation.totalPayables")}</p>
            <p className="text-label-sm content-base-secondary">
              {formatMoneyKzt(totalNetAmount)} + {formatMoneyKzt(totalVatAmount)} ={" "}
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(subtotal)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
