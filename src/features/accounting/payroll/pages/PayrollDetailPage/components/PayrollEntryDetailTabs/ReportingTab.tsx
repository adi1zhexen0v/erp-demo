import { useTranslation } from "react-i18next";
import { TickCircle, Clock, Chart2, MoneyRecive } from "iconsax-react";
import { formatMoneyKzt, toNumber, type Locale } from "@/shared/utils";
import type { PayrollEntry } from "@/features/accounting/payroll";

interface Props {
  entry: PayrollEntry;
  locale: Locale;
  isPaid: boolean;
  isFullScreen?: boolean;
}

export default function ReportingTab({ entry, locale, isPaid, isFullScreen = false }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const currentLocale = (i18n.language as "ru" | "kk" | "en") || locale || "ru";

  const grossSalary = toNumber(entry.gross_salary);
  const opvr = toNumber(entry.opvr);
  const so = toNumber(entry.so);
  const oosms = toNumber(entry.oosms);
  const sn = toNumber(entry.sn);
  const netSalary = toNumber(entry.net_salary);
  const totalEmployer = toNumber(entry.total_employer_contributions);
  const opv = toNumber(entry.opv);
  const ipn = toNumber(entry.ipn);
  const vosms = toNumber(entry.vosms);

  const totalExpenses = grossSalary + totalEmployer;

  const cashBefore = 1000000;
  const cashAfter = cashBefore - totalExpenses;

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

          <p className="text-label-sm content-base-primary mb-2">{t("tabs.reporting.payrollExpenses")}</p>

          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.salaryAccount")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(grossSalary, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.opvrPercent")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(opvr, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.soPercent")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(so, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.oosmsPercent")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(oosms, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.snPercent")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(sn, currentLocale)}</span>
            </div>
          </div>

          <div className="surface-component-fill radius-sm p-3 mb-3">
            <p className="text-label-sm content-action-neutral mb-1">{t("tabs.reporting.totalFormula")}</p>
            <p className="text-label-sm content-base-secondary">
              {formatMoneyKzt(grossSalary)} + {formatMoneyKzt(opvr)} + {formatMoneyKzt(so)} +{" "}
              {formatMoneyKzt(oosms)} + {formatMoneyKzt(sn)} ={" "}
              <span className="text-body-bold-md content-base-primary mt-1">
                {formatMoneyKzt(totalExpenses, currentLocale)}
              </span>
            </p>
          </div>

          <div className="border-t surface-base-stroke pt-3">
            <div className="flex items-center justify-between">
              <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.totalExpenses")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(totalExpenses, currentLocale)}</span>
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
              <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(cashAfter, currentLocale)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.periodChange")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalExpenses, currentLocale)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.retainedEarnings")}</span>
              <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(cashBefore, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.periodResult")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalExpenses, currentLocale)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t surface-base-stroke pt-3">
            <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.totalCapital")}</span>
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(cashAfter, currentLocale)}</span>
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
            <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(cashBefore, currentLocale)}</span>
          </div>

          <p className="text-label-sm content-base-primary mb-2 mt-5">{t("tabs.reporting.operatingOutflows")}</p>
          <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke mb-3">
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.salaryPayment")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(netSalary, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.taxesIPN")}</span>
              <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(ipn, currentLocale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm content-action-neutral">{t("tabs.reporting.socialPayments")}</span>
              <span className="text-body-bold-md content-action-negative">
                {formatMoneyKzt(opv + opvr + vosms + oosms + so + sn, currentLocale)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t surface-base-stroke pt-3 mb-3">
            <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.totalOutflows")}</span>
            <span className="text-body-bold-md content-action-negative">{formatMoneyKzt(totalExpenses, currentLocale)}</span>
          </div>

          <div className="surface-component-fill radius-sm p-3 mb-3">
            <p className="text-label-sm content-action-neutral mb-1">{t("tabs.reporting.periodChangeDetail")}</p>
            <p className="text-label-sm content-base-secondary">
              {formatMoneyKzt(cashBefore)} − {formatMoneyKzt(totalExpenses)} ={" "}
              <span className="text-body-bold-md content-base-primary mt-1">{formatMoneyKzt(cashAfter, currentLocale)}</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-body-bold-sm content-base-primary">{t("tabs.reporting.closingBalance")}</span>
            <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(cashAfter, currentLocale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
