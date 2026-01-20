import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, InfoCircle } from "iconsax-react";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import type { PayrollEntry, ConstantsUsed } from "@/features/accounting/payroll";
import { formatPercentageFromRate } from "@/features/accounting/shared";

interface Props {
  entry: PayrollEntry;
  constants_used?: ConstantsUsed;
  isFullScreen?: boolean;
}

export default function AccrualTab({ entry, constants_used, isFullScreen = false }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";
  const [isIpnExpanded, setIsIpnExpanded] = useState(true);
  const [isSoExpanded, setIsSoExpanded] = useState(true);
  const [isSnExpanded, setIsSnExpanded] = useState(true);

  const salary = toNumber(entry.salary_amount);
  const grossSalary = toNumber(entry.gross_salary);
  const opv = toNumber(entry.opv);
  const ipn = toNumber(entry.ipn);
  const vosms = toNumber(entry.vosms);
  const totalDeductions = toNumber(entry.total_employee_deductions);
  const opvr = toNumber(entry.opvr);
  const so = toNumber(entry.so);
  const oosms = toNumber(entry.oosms);
  const sn = toNumber(entry.sn);
  const totalEmployer = toNumber(entry.total_employer_contributions);
  const netSalary = toNumber(entry.net_salary);

  const ipnBase = toNumber(entry.ipn_base);
  const standardDeduction = toNumber(entry.standard_deduction);

  const mrp = constants_used?.mrp ?? 4325;
  const mzp = constants_used?.mzp ?? 85000;
  const mrpDeductionCount = constants_used?.mrp_deduction_count ?? 14;
  const mrpDeduction = mrpDeductionCount * mrp;
  const ipnRate = constants_used?.ipn_rate ?? entry.calculation_snapshot?.flags?.ipn_rate ?? 0.1;
  const soRate = constants_used?.so_rate ?? 0.05;
  const snRate = constants_used?.sn_rate ?? 0.06;
  const opvrRate = constants_used?.opvr_rate ?? 0.035;
  const oosmsRate = constants_used?.oosms_rate ?? 0.03;

  return (
    <div className={`grid gap-3 p-1 ${isFullScreen ? "grid-cols-2" : "grid-cols-1"}`}>
      <div className="p-5 radius-lg border surface-base-stroke">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-full bg-info-500/15 background-on-background-strong-info flex items-center justify-center text-label-xs">
            1
          </div>
          <span className="text-body-bold-lg content-base-primary">{t("tabs.accrual.accruals")} </span>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.grossSalary")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.salaryFormula")} {formatMoneyKzt(salary, locale)}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(grossSalary, locale)}</p>
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
              {t("tabs.accrual.opvFormula", { salary: formatMoneyKzt(grossSalary) })}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatMoneyKzt(opv, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">
              {t("tabs.accrual.ipnTitle")} {formatPercentageFromRate(ipnRate)}
            </h6>
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
              <div className="flex flex-col gap-3">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.standardDeduction2026")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {mrpDeductionCount} {t("tabs.accrual.mrp")} {t("tabs.accrual.mrpTimes")} {formatMoneyKzt(mrp, locale)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(mrpDeduction, locale)}</p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">
                  {t("tabs.accrual.mrpInfo")} {formatMoneyKzt(mrp, locale)}, {t("tabs.accrual.mzpInfo")}{" "}
                  {formatMoneyKzt(mzp, locale)}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <div className="flex flex-col gap-0.5">
                  <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.ipnBase")}</h6>
                  <p className="text-label-xs content-action-neutral">{t("tabs.accrual.ipnBaseFormula")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(grossSalary)} − {formatMoneyKzt(opv)} − {formatMoneyKzt(vosms)} −{" "}
                    {formatMoneyKzt(standardDeduction)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(standardDeduction, locale)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">
                  {t("tabs.accrual.ipnFromBase", { percentage: formatPercentageFromRate(ipnRate) })}
                </h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(ipnBase)} {t("tabs.accrual.mrpTimes")} {formatPercentageFromRate(ipnRate)}
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
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(ipn, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.vosmsTitle")}</h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.vosmsFormula", { salary: formatMoneyKzt(grossSalary) })}
            </span>
            <p className="text-body-bold-md content-action-negative">- {formatMoneyKzt(vosms, locale)}</p>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalDeducted")}</h6>
            <span className="text-label-xs content-action-neutral">{t("tabs.accrual.deductionsFormula")}</span>
          </div>

          <p className="text-display-2xs content-base-primary">{formatMoneyKzt(totalDeductions, locale)}</p>
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
          <h6 className="text-body-regular-sm content-base-primary">
            {t("tabs.accrual.opvrTitle", { percentage: formatPercentageFromRate(opvrRate) })}
          </h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.opvrFormula", {
                salary: formatMoneyKzt(grossSalary),
                percentage: formatPercentageFromRate(opvrRate),
              })}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(opvr, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
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
                    {t("tabs.accrual.soBase")} {formatMoneyKzt(grossSalary)} − {formatMoneyKzt(opv)} ={" "}
                    {formatMoneyKzt(grossSalary - opv, locale)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(grossSalary - opv, locale)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.soPercent")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(grossSalary - opv)} {t("tabs.accrual.mrpTimes")} {formatPercentageFromRate(soRate)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatMoneyKzt((grossSalary - opv) * soRate, locale)}
                  </p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">
                  {t("tabs.accrual.soWithLimits")} {formatMoneyKzt(so, locale)}
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

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <h6 className="text-body-regular-sm content-base-primary">
            {t("tabs.accrual.oosmsTitle", { percentage: formatPercentageFromRate(oosmsRate) })}
          </h6>
          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.oosmsFormula", {
                salary: formatMoneyKzt(grossSalary),
                percentage: formatPercentageFromRate(oosmsRate),
              })}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(oosms, locale)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-3 pt-3 border-t surface-base-stroke">
          <div className="flex justify-between items-center">
            <h6 className="text-body-regular-sm content-base-primary">
              {t("tabs.accrual.snTitle", { percentage: formatPercentageFromRate(snRate) })}
            </h6>
            <span className="content-base-primary cursor-pointer" onClick={() => setIsSnExpanded(!isSnExpanded)}>
              <ArrowDown2
                className={`transition-transform duration-300 ${isSnExpanded ? "rotate-180" : ""}`}
                size={16}
                color="currentColor"
              />
            </span>
          </div>
          {isSnExpanded && (
            <div className="surface-component-fill radius-sm p-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <h6 className="text-body-regular-sm content-base-primary">
                  {t("tabs.accrual.snFormula", { percentage: formatPercentageFromRate(snRate) })}
                </h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {t("tabs.accrual.snBase")} {formatMoneyKzt(grossSalary)} − {formatMoneyKzt(opv)} −{" "}
                    {formatMoneyKzt(vosms)} = {formatMoneyKzt(grossSalary - opv - vosms, locale)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatMoneyKzt(grossSalary - opv - vosms, locale)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.snPercent")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt(grossSalary - opv - vosms)} {t("tabs.accrual.mrpTimes")}{" "}
                    {formatPercentageFromRate(snRate)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatMoneyKzt((grossSalary - opv - vosms) * snRate, locale)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t surface-base-stroke">
                <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.snToPay")}</h6>
                <div className="flex items-center justify-between">
                  <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
                    {formatMoneyKzt((grossSalary - opv - vosms) * snRate)} − {formatMoneyKzt(so)}
                  </span>
                  <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(sn, locale)}</p>
                </div>
              </div>

              <div className="py-2 px-3 surface-container-fill radius-xs flex items-center justify-start gap-2">
                <span className="content-base-primary">
                  <InfoCircle size={16} color="currentColor" />
                </span>
                <p className="text-label-xs content-base-primary">{t("tabs.accrual.snNote")}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="pl-2 border-l surface-base-stroke text-label-xs content-action-neutral">
              {t("tabs.accrual.snToPay")}
            </span>
            <p className="text-body-bold-md content-base-primary">{formatMoneyKzt(sn, locale)}</p>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalEmployerExpenses")}</h6>
            <span className="text-label-xs content-action-neutral">{t("tabs.accrual.employerExpensesFormula")}</span>
          </div>

          <p className="text-display-2xs content-base-primary">{formatMoneyKzt(totalEmployer, locale)}</p>
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
              <p className="text-body-regular-sm content-base-primary">{t("tabs.accrual.netPayFormula")}</p>
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
                {formatMoneyKzt(grossSalary)} - {formatMoneyKzt(totalDeductions)} =
              </p>
              <h5 className="text-display-lg content-action-positive">{formatMoneyKzt(netSalary, locale)}</h5>
              <span className="text-label-xs content-action-neutral">{t("tabs.accrual.amountToCard")}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 radius-sm p-3 surface-component-fill flex justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            <h6 className="text-body-regular-sm content-base-primary">{t("tabs.accrual.totalCompanyExpenses")}</h6>
            <span className="text-label-xs content-action-neutral">
              {formatMoneyKzt(grossSalary)} {t("tabs.accrual.companyExpensesFormula").split(" + ")[0]} +{" "}
              {formatMoneyKzt(totalEmployer)} {t("tabs.accrual.companyExpensesFormula").split(" + ")[1]}
            </span>
          </div>

          <p className="text-display-2xs content-base-primary whitespace-nowrap">
            {formatMoneyKzt(grossSalary + totalEmployer, locale)}
          </p>
        </div>
      </div>
    </div>
  );
}
