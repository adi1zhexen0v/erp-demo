import { useTranslation } from "react-i18next";
import { TickCircle, Clock, Chart2, MoneyRecive } from "iconsax-react";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import type { GPHPayment } from "@/features/accounting/payroll";

interface Props {
  payment: GPHPayment;
  isPaid: boolean;
  isFullScreen?: boolean;
}

export default function ReportingTab({ payment, isPaid, isFullScreen = false }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  const grossAmount = toNumber(payment.gross_amount);
  const opv = toNumber(payment.opv);
  const ipn = toNumber(payment.ipn);
  const vosms = toNumber(payment.vosms);
  const so = toNumber(payment.so);
  const netAmount = toNumber(payment.net_amount);
  const totalCost = toNumber(payment.total_cost);

  const cashBefore = 1000000;
  const cashAfter = cashBefore - totalCost;

  return (
    <div className="flex flex-col gap-5">
      <div
        className={`px-3 py-2 radius-xs ${isPaid ? "surface-positive-subtle" : "surface-notice-subtle"} ${isPaid ? "background-on-background-strong-positive" : "background-on-background-strong-notice"} flex justify-start items-start gap-2`}>
        <div className="flex items-center justify-center mt-0.5">
          {isPaid ? (
            <TickCircle size={16} color="currentColor" variant="Bold" />
          ) : (
            <Clock size={16} color="currentColor" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-label-sm">
            {isPaid ? t("tabs.reporting.operationCompleted") : t("tabs.reporting.waitingPayment")}
          </p>
          <p className="text-body-regular-xs">
            {isPaid ? t("tabs.reporting.operationCompletedDesc") : t("tabs.reporting.waitingPaymentDesc")}
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
            <span className="text-body-bold-lg content-base-primary">{t("tabs.reporting.profitLoss")}</span>
          </div>

          <p className="text-label-sm content-base-primary mb-2">{t("tabs.gph.contractorExpenses")}</p>

          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.gph.serviceExpense")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(grossAmount, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.soPercent")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(so, locale)}</span>
            </div>
          </div>

          <div className="surface-component-fill radius-sm p-3 mb-3">
            <p className="text-label-sm content-action-neutral mb-1">{t("tabs.reporting.totalFormula")}</p>
            <p className="text-label-sm content-base-secondary">
              {formatMoneyKzt(grossAmount)} + {formatMoneyKzt(so)} ={" "}
              <span className="text-body-bold-md content-base-primary mt-1">{formatMoneyKzt(totalCost, locale)}</span>
            </p>
          </div>

          <div className="border-t surface-base-stroke pt-3">
            <div className="flex items-center justify-between">
              <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.totalExpenses")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(totalCost, locale)}</span>
            </div>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
              <span className="content-action-neutral">
                <Chart2 size={16} color="currentColor" />
              </span>
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("tabs.reporting.balance")}</span>
          </div>

          <p className="text-label-sm content-base-primary mb-2">{t("tabs.reporting.assets")}</p>
          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.cashAccount")}</span>
              <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(cashAfter, locale)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.periodChange")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalCost, locale)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.retainedEarnings")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(cashBefore, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.periodResult")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalCost, locale)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t surface-base-stroke pt-3">
            <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.totalCapital")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(cashAfter, locale)}</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
              <span className="content-action-neutral">
                <MoneyRecive size={16} color="currentColor" />
              </span>
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("tabs.reporting.cashFlow")}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-label-sm content-action-neutral">{t("tabs.reporting.openingBalance")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(cashBefore, locale)}</span>
          </div>

          <p className="text-label-sm content-base-primary mb-2 mt-5">{t("tabs.reporting.operatingOutflows")}</p>
          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.gph.contractorPaymentShort")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(netAmount, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.taxesIPN")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(ipn, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.socialPayments")}</span>
              <span className="text-body-bold-md content-action-negative">
                {formatMoneyKzt(opv + vosms + so, locale)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t surface-base-stroke pt-3 mb-3">
            <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.totalOutflows")}</span>
            <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalCost, locale)}</span>
          </div>

          <div className="surface-component-fill radius-sm p-3 mb-3">
            <p className="text-label-sm content-action-neutral mb-1">{t("tabs.reporting.periodChangeDetail")}</p>
            <p className="text-label-sm content-base-secondary">
              {formatMoneyKzt(cashBefore)} − {formatMoneyKzt(totalCost)} ={" "}
              <span className="text-body-bold-md content-base-primary mt-1">{formatMoneyKzt(cashAfter, locale)}</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.closingBalance")}</span>
            <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(cashAfter, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

