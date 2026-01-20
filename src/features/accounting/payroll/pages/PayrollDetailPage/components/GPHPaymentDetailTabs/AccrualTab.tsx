import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, InfoCircle, TickCircle, CloseCircle } from "iconsax-react";
import { formatMoneyKzt, toNumber, formatDateForDisplay } from "@/shared/utils";
import { useLocale } from "@/shared/hooks";
import type { GPHPayment, ConstantsUsed } from "@/features/accounting/payroll";
import { formatPercentageFromRate } from "@/features/accounting/shared";

interface Props {
  payment: GPHPayment;
  constants_used?: ConstantsUsed;
  isFullScreen?: boolean;
}

export default function AccrualTab({ payment, constants_used, isFullScreen = false }: Props) {
  const { t } = useTranslation("PayrollPage");
  const locale = useLocale();
  const [isIpnExpanded, setIsIpnExpanded] = useState(true);
  const [isSoExpanded, setIsSoExpanded] = useState(true);

  const grossAmount = toNumber(payment.gross_amount);
  const opv = toNumber(payment.opv);
  const ipn = toNumber(payment.ipn);
  const vosms = toNumber(payment.vosms);
  const so = toNumber(payment.so);
  const totalWithheld = toNumber(payment.total_withheld);
  const netAmount = toNumber(payment.net_amount);
  const totalCost = toNumber(payment.total_cost);

  const mrp = constants_used?.mrp ?? 4325;
  const mrpDeductionCount = constants_used?.mrp_deduction_count ?? 14;
  const mrpDeduction = mrpDeductionCount * mrp;
  const opvRate = constants_used?.opv_rate ?? 0.1;
  const vosmsRate = constants_used?.vosms_rate ?? 0.02;
  const ipnRate = constants_used?.ipn_rate ?? 0.1;
  const soRate = constants_used?.so_rate ?? 0.05;

  const applyMrpDeduction = payment.apply_mrp_deduction ?? payment.calculation_snapshot?.input?.apply_mrp_deduction ?? false;
  const ipnBase = grossAmount - opv - vosms - (applyMrpDeduction ? mrpDeduction : 0);

  return (
    <div className={`grid gap-3 p-1 ${isFullScreen ? "grid-cols-2" : "grid-cols-1"}`}>
      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            1
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.accruals")}</span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("detail.gphPayment.completionAct")}</h6>
          <div className="surface-component-fill radius-sm p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-label-xs content-action-neutral">{t("detail.gphPayment.actNumber")}</span>
              <span className="text-body-bold-sm content-base-primary">{payment.completion_act.display_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-xs content-action-neutral">{t("detail.gphPayment.serviceName")}</span>
              <span className="text-body-bold-sm content-base-primary truncate max-w-[200px]">
                {payment.completion_act.service_name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label-xs content-action-neutral">{t("detail.gphPayment.period")}</span>
              <span className="text-body-bold-sm content-base-primary">
                {formatDateForDisplay(payment.completion_act.period_start_date)} -{" "}
                {formatDateForDisplay(payment.completion_act.period_end_date)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.gph.grossAmount")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.gph.fromCompletionAct")}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(grossAmount, locale)}</p>
          </div>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            2
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.employeeDeductions")}</span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.opvTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {formatMoneyKzt(grossAmount)} × {formatPercentageFromRate(opvRate)}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatMoneyKzt(opv, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.ipnTitle")} {formatPercentageFromRate(ipnRate)}</h6>
            <span className="content-base-primary cursor-pointer" onClick={() => setIsIpnExpanded(!isIpnExpanded)}>
              <ArrowDown2
                className={`transition-transform duration-300 ${isIpnExpanded ? "rotate-180" : ""}`}
                size={16}
                color="currentColor"
              />
            </span>
          </div>
          {isIpnExpanded && (
            <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-label-xs content-action-neutral">{t("tabs.gph.mrpDeduction")}</span>
                {applyMrpDeduction ? (
                  <div className="flex items-center gap-1 content-action-positive">
                    <TickCircle size={14} color="currentColor" variant="Bold" />
                    <span className="text-label-xs">{t("tabs.gph.applied")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 content-action-neutral">
                    <CloseCircle size={14} color="currentColor" />
                    <span className="text-label-xs">{t("tabs.gph.notApplied")}</span>
                  </div>
                )}
              </div>

              {applyMrpDeduction && (
                <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                  <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.standardDeduction2026")}</h6>
                  <div className="flex items-center justify-between">
                    <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                      {mrpDeductionCount} {t("tabs.accrual.mrp")} × {formatMoneyKzt(mrp, locale)}
                    </span>
                    <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(mrpDeduction, locale)}</p>
                  </div>
                </div>
              )}

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">
                  {t("tabs.gph.ipnInfo")}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <div className="flex flex-col gap-0.5">
                  <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.ipnBase")}</h6>
                  <p className="text-label-xs content-action-neutral">{t("tabs.gph.ipnBaseFormula")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(grossAmount)} − {formatMoneyKzt(opv)} − {formatMoneyKzt(vosms)}
                    {applyMrpDeduction && ` − ${formatMoneyKzt(mrpDeduction)}`}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(Math.max(0, ipnBase), locale)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.ipnFromBase", { percentage: formatPercentageFromRate(ipnRate) })}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(Math.max(0, ipnBase))} × {formatPercentageFromRate(ipnRate)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(ipn, locale)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.ipnToPay")}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatMoneyKzt(ipn, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.vosmsTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {formatMoneyKzt(grossAmount)} × {formatPercentageFromRate(vosmsRate)}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatMoneyKzt(vosms, locale)}</p>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalDeducted")}</h6>
            <span className="text-label-xs content-action-neutral">{t("tabs.gph.deductionsFormula")}</span>
          </div>
          <p className="text-display-2xs content-base-primary">{formatMoneyKzt(totalWithheld, locale)}</p>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            3
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.employerContributions")}</span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soTitle")}</h6>
            <span className="content-base-primary cursor-pointer" onClick={() => setIsSoExpanded(!isSoExpanded)}>
              <ArrowDown2
                className={`transition-transform duration-300 ${isSoExpanded ? "rotate-180" : ""}`}
                size={16}
                color="currentColor"
              />
            </span>
          </div>
          {isSoExpanded && (
            <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soFormula")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {t("tabs.accrual.soBase")} {formatMoneyKzt(grossAmount)} − {formatMoneyKzt(opv)} ={" "}
                    {formatMoneyKzt(grossAmount - opv, locale)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(grossAmount - opv, locale)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soPercent")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(grossAmount - opv)} × {formatPercentageFromRate(soRate)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt((grossAmount - opv) * soRate, locale)}</p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">
                  {t("tabs.gph.soInfo")}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.soToPay")}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(so, locale)}</p>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalEmployerExpenses")}</h6>
            <span className="text-label-xs content-action-neutral">{t("tabs.gph.employerFormula")}</span>
          </div>
          <p className="text-display-2xs content-base-primary">{formatMoneyKzt(so, locale)}</p>
        </div>
      </div>

      <div className="p-5 radius-lg border surface-base-stroke flex flex-col justify-between gap-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
              4
            </div>
            <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.netPay")}</span>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center gap-3 py-3 border-t border-b surface-base-stroke">
              <p className="text-body-regular-sm content-base-primary">{t("tabs.gph.netPayFormula")}</p>
              <div className="flex items-center justify-center gap-1.5">
                <div className="py-1 px-2 rounded-4xl text-label-sm surface-info-subtle background-on-background-strong-info">
                  {t("tabs.accrual.accrued")}
                </div>
                <span className="text-body-bold-lg content-base-primary">−</span>
                <div className="py-1 px-2 rounded-4xl text-label-sm surface-negative-subtle background-on-background-strong-negative">
                  {t("tabs.accrual.deductions")}
                </div>
                <span className="text-body-bold-lg content-base-primary">=</span>
                <div className="py-1 px-2 rounded-4xl text-label-sm surface-positive-subtle background-on-background-strong-positive">
                  {t("tabs.accrual.netPayResult")}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 mt-3">
              <p className="text-body-regular-sm content-base-primary">
                {formatMoneyKzt(grossAmount)} - {formatMoneyKzt(totalWithheld)} =
              </p>
              <h5 className="text-display-lg content-action-positive">{formatMoneyKzt(netAmount, locale)}</h5>
              <span className="text-label-xs content-action-neutral">{t("tabs.gph.amountToContractor")}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.gph.totalCompanyExpenses")}</h6>
            <span className="text-label-xs content-action-neutral">
              {formatMoneyKzt(grossAmount)} + {formatMoneyKzt(so)}
            </span>
          </div>
          <p className="text-display-2xs content-base-primary whitespace-nowrap">{formatMoneyKzt(totalCost, locale)}</p>
        </div>
      </div>
    </div>
  );
}

