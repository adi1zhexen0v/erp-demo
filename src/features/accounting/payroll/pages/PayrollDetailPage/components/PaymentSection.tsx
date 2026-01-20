import { useTranslation } from "react-i18next";
import { Hospital, Profile, Share, Glass, PercentageSquare } from "iconsax-react";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import { aggregateGPHTotals } from "@/features/accounting/payroll";
import type { GPHPayment } from "@/features/accounting/payroll";

interface Props {
  totalNet: string;
  totalOpv: string;
  totalOpvr: string;
  totalVosms: string;
  totalOosms: string;
  totalIpn: string;
  totalSn: string;
  totalSo: string;
  gphPayments?: GPHPayment[];
}

interface PaymentDestination {
  icon: React.ReactNode;
  label: string;
  amount: string;
  description: string;
  className: string;
}

export default function PaymentSection({
  totalNet,
  totalOpv,
  totalOpvr,
  totalVosms,
  totalOosms,
  totalIpn,
  totalSn,
  totalSo,
  gphPayments = [],
}: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  const gphTotals = aggregateGPHTotals(gphPayments);

  const opv = toNumber(totalOpv);
  const opvr = toNumber(totalOpvr);
  const vosms = toNumber(totalVosms);
  const oosms = toNumber(totalOosms);
  const ipn = toNumber(totalIpn);
  const sn = toNumber(totalSn);
  const so = toNumber(totalSo);

  const totalAllOpv = opv + gphTotals.opv;
  const totalAllVosms = vosms + gphTotals.vosms;
  const totalAllIpn = ipn + gphTotals.ipn;
  const totalAllSo = so + gphTotals.so;

  const paymentDestinations: PaymentDestination[] = [
    {
      icon: <Profile size={16} color="currentColor" variant="Bold" />,
      label: t("paymentSection.destinations.employees"),
      amount: formatMoneyKzt(totalNet, locale),
      description: t("paymentSection.destinationDescriptions.employees"),
      className: "content-action-brand",
    },
    ...(gphPayments.length > 0
      ? [
          {
            icon: <Profile size={16} color="currentColor" variant="Bold" />,
            label: t("paymentSection.destinations.contractors"),
            amount: formatMoneyKzt(gphTotals.net, locale),
            description: t("paymentSection.destinationDescriptions.contractors"),
            className: "content-action-notice",
          },
        ]
      : []),

    {
      icon: <Hospital size={16} color="currentColor" variant="Bold" />,
      label: t("paymentSection.destinations.medical"),
      amount: formatMoneyKzt(totalAllVosms + oosms, locale),
      description: t("paymentSection.destinationDescriptions.medical"),
      className: "content-action-negative",
    },
    {
      icon: <Share size={16} color="currentColor" variant="Bold" />,
      label: t("paymentSection.destinations.social"),
      amount: formatMoneyKzt(totalAllSo, locale),
      description: t("paymentSection.destinationDescriptions.social"),
      className: "content-action-info",
    },
    {
      icon: <Glass size={16} color="currentColor" variant="Bold" />,
      label: t("paymentSection.destinations.enpf"),
      amount: formatMoneyKzt(totalAllOpv + opvr, locale),
      description: t("paymentSection.destinationDescriptions.enpf"),
      className: "content-action-notice",
    },
    {
      icon: <PercentageSquare size={16} color="currentColor" variant="Bold" />,
      label: t("paymentSection.destinations.tax"),
      amount: formatMoneyKzt(totalAllIpn + sn, locale),
      description: t("paymentSection.destinationDescriptions.tax"),
      className: "content-action-positive",
    },
  ];

  return (
    <div className="p-5 radius-lg border surface-component-stroke flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-body-bold-lg content-base-primary">{t("paymentSection.breakdown")}</h3>
        <p className="text-body-regular-sm content-action-neutral">{t("paymentSection.totalPayments")}</p>
      </div>
      <div className="flex flex-col gap-3">
        {paymentDestinations.map((dest) => (
          <div key={dest.label} className="p-4 radius-sm surface-component-fill flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 aspect-square flex items-center justify-center radius-xs surface-container-fill ${dest.className}`}>
                {dest.icon}
              </div>

              <span className="text-label-sm content-base-primary">{dest.label}</span>
            </div>
            <p className="text-display-xs content-base-primary">{dest.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
