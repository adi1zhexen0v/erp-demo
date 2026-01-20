import { useTranslation } from "react-i18next";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import { formatPercentageFromRate } from "@/features/accounting/shared";
import { aggregateGPHTotals } from "@/features/accounting/payroll";
import type { GPHPayment, ConstantsUsed } from "@/features/accounting/payroll";

interface Props {
  opv: string;
  vosms: string;
  ipn: string;
  opvr: string;
  oppv: string;
  so: string;
  oosms: string;
  sn: string;
  totalEmployeeDeductions: string;
  totalEmployerContributions: string;
  gphPayments?: GPHPayment[];
  constants_used?: ConstantsUsed;
}

interface TaxItem {
  label: string;
  rate: string;
  amount: string;
}

function TaxTable({
  title,
  items,
  total,
  totalLabel,
  stretch = false,
}: {
  title: string;
  items: TaxItem[];
  total: string;
  totalLabel: string;
  stretch?: boolean;
}) {
  return (
    <div className={`p-5 radius-lg border surface-component-stroke flex flex-col gap-5 ${stretch ? "flex-1" : ""}`}>
      <h4 className="text-body-bold-lg content-base-primary">{title}</h4>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-end justify-between gap-5 ${index < items.length - 1 ? "pb-3 border-b surface-component-stroke" : ""}`}>
            <span className="text-label-sm content-action-neutral">{item.label}</span>
            <p className="text-body-bold-lg content-base-primary">{item.amount}</p>
          </div>
        ))}
      </div>

      <div className={`p-4 radius-sm surface-component-fill flex justify-between items-center gap-5 ${stretch ? "mt-auto" : ""}`}>
        <span className="text-body-regular-md content-base-primary">{totalLabel}</span>
        <p className="text-display-2xs content-base-primary">{total}</p>
      </div>
    </div>
  );
}

export default function AccountingSection({
  opv,
  vosms,
  ipn,
  opvr,
  oppv,
  so,
  oosms,
  sn,
  totalEmployeeDeductions,
  totalEmployerContributions,
  gphPayments = [],
  constants_used,
}: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  const gphTotals = aggregateGPHTotals(gphPayments);

  const payrollOpv = toNumber(opv);
  const payrollVosms = toNumber(vosms);
  const payrollIpn = toNumber(ipn);

  const totalOpv = payrollOpv + gphTotals.opv;
  const totalVosms = payrollVosms + gphTotals.vosms;
  const totalIpn = payrollIpn + gphTotals.ipn;
  const totalAllEmployeeDeductions = toNumber(totalEmployeeDeductions) + gphTotals.totalWithheld;

  const employeeDeductions: TaxItem[] = [
    { label: t("detail.taxSummary.opv"), rate: formatPercentageFromRate(constants_used?.opv_rate ?? 0.1), amount: formatMoneyKzt(totalOpv, locale) },
    { label: t("detail.taxSummary.vosms"), rate: formatPercentageFromRate(constants_used?.vosms_rate ?? 0.02), amount: formatMoneyKzt(totalVosms, locale) },
    { label: t("detail.taxSummary.ipn"), rate: formatPercentageFromRate(constants_used?.ipn_rate ?? 0.1), amount: formatMoneyKzt(totalIpn, locale) },
  ];

  const payrollSo = toNumber(so);

  const totalSo = payrollSo + gphTotals.so;
  const totalAllEmployerContributions = toNumber(totalEmployerContributions) + gphTotals.so;

  const employerContributions: TaxItem[] = [
    { label: t("detail.taxSummary.opvr"), rate: formatPercentageFromRate(constants_used?.opvr_rate ?? 0.035), amount: formatMoneyKzt(opvr, locale) },
    { label: t("detail.taxSummary.oppv"), rate: formatPercentageFromRate(constants_used?.oppv_rate ?? 0.05), amount: formatMoneyKzt(oppv, locale) },
    { label: t("detail.taxSummary.so"), rate: formatPercentageFromRate(constants_used?.so_rate ?? 0.05), amount: formatMoneyKzt(totalSo, locale) },
    { label: t("detail.taxSummary.oosms"), rate: formatPercentageFromRate(constants_used?.oosms_rate ?? 0.03), amount: formatMoneyKzt(oosms, locale) },
    { label: t("detail.taxSummary.sn"), rate: formatPercentageFromRate(constants_used?.sn_rate ?? 0.06), amount: formatMoneyKzt(sn, locale) },
  ];

  return (
    <div className="flex flex-col gap-3">
      <TaxTable
        title={t("accountingSection.employerLiabilities")}
        items={employerContributions}
        total={formatMoneyKzt(totalAllEmployerContributions, locale)}
        totalLabel={t("entry.fields.totalEmployerContributions")}
      />

      <TaxTable
        title={t("accountingSection.employeeLiabilities")}
        items={employeeDeductions}
        total={formatMoneyKzt(totalAllEmployeeDeductions, locale)}
        totalLabel={t("entry.fields.totalEmployeeDeductions")}
        stretch
      />
    </div>
  );
}
