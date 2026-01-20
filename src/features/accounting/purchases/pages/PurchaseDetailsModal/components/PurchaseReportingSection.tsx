import { useTranslation } from "react-i18next";
import { TickCircle, Clock, Chart2, MoneyRecive } from "iconsax-react";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import { Toast } from "@/shared/ui";
import type { GroupedPurchase } from "../../../types";
import { calculateNetAmount, calculateVatAmount, DEFAULT_VAT_RATE } from "../../../utils";
import { DEFAULT_INITIAL_CASH } from "../../../consts";

interface Props {
  purchase: GroupedPurchase;
  isFullScreen: boolean;
}

export default function PurchaseReportingSection({ purchase, isFullScreen }: Props) {
  const { t } = useTranslation("PurchasesPage");

  const totalAmount = toNumber(purchase.total_amount);
  const vatRate = DEFAULT_VAT_RATE;
  const netAmount = calculateNetAmount(totalAmount, vatRate);
  const vatAmount = calculateVatAmount(totalAmount, vatRate);

  const isCompleted = purchase.status === "paid";

  const initialCash = DEFAULT_INITIAL_CASH;
  const finalCash = initialCash - totalAmount;

  return (
    <div className="flex flex-col gap-5">
      <div
        className={`px-3 py-2 radius-xs ${isCompleted ? "surface-positive-subtle" : "surface-notice-subtle"} ${isCompleted ? "background-on-background-strong-positive" : "background-on-background-strong-notice"} flex justify-start items-start gap-2`}>
        <div className="flex items-center justify-center mt-0.5">
          {isCompleted ? (
            <TickCircle size={16} color="currentColor" variant="Bold" />
          ) : (
            <Clock size={16} color="currentColor" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-label-sm">
            {isCompleted ? t("detail.reporting.operationComplete") : t("detail.reporting.waitingPayment")}
          </p>
          <p className="text-body-regular-xs">
            {isCompleted ? t("detail.reporting.operationCompleteDesc") : t("detail.reporting.waitingPaymentDesc")}
          </p>
        </div>
      </div>

      <div className={`grid gap-3 ${isFullScreen ? "grid-cols-3" : "grid-cols-1"}`}>
        <div className="p-5 radius-lg border surface-base-stroke">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
              <span className="content-action-neutral">
                <Chart2 size={16} color="currentColor" />
              </span>
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("detail.reporting.pnlTitle")}</span>
          </div>

          <div className="mb-4">
            <Toast
              color="grey"
              text={t("detail.reporting.pnlNote")}
              additionalText={t("detail.reporting.pnlNoteDesc")}
              closable={false}
              autoClose={false}
              isFullWidth
            />
          </div>

          <div className="flex justify-between items-center py-3 border-t surface-base-stroke">
            <span className="text-body-bold-sm content-base-primary">{t("detail.reporting.totalExpenses")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(0)}</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-label-sm content-action-neutral">{t("detail.reporting.periodResult")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(0)}</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
              <span className="content-action-neutral">
                <Chart2 size={16} color="currentColor" />
              </span>
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("detail.reporting.balanceTitle")}</span>
          </div>

          <p className="text-label-sm content-base-primary mb-2">{t("detail.reporting.assets")}</p>
          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.cash1030")}</span>
              <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(finalCash)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.periodChange")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.inventory1330")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(netAmount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.vatReceivable1420")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(vatAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.retainedEarnings")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(initialCash)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.periodResult")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalAmount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t surface-base-stroke pt-3">
            <span className="text-body-bold-sm content-base-primary">{t("detail.reporting.totalCapital")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(finalCash)}</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
              <span className="content-action-neutral">
                <MoneyRecive size={16} color="currentColor" />
              </span>
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("detail.reporting.cashFlowTitle")}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-label-sm content-action-neutral">{t("detail.reporting.openingBalance")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(initialCash)}</span>
          </div>

          <p className="text-label-sm content-base-primary mb-2 mt-5">{t("detail.reporting.operatingOutflows")}</p>
          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("detail.reporting.supplierPayments")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalAmount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t surface-base-stroke pt-3 mb-3">
            <span className="text-body-bold-sm content-base-primary">{t("detail.reporting.totalOutflows")}</span>
            <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalAmount)}</span>
          </div>

          <div className="surface-component-fill radius-sm p-3 mb-3">
            <p className="text-label-sm content-action-neutral mb-1">{t("detail.reporting.periodChange")}</p>
            <p className="text-label-sm content-base-secondary">
              {formatMoneyKzt(initialCash)} − {formatMoneyKzt(totalAmount)} ={" "}
              <span className="text-body-bold-md content-base-primary mt-1">{formatMoneyKzt(finalCash)}</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-bold-sm content-base-primary">{t("detail.reporting.closingBalance")}</span>
            <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(finalCash)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

