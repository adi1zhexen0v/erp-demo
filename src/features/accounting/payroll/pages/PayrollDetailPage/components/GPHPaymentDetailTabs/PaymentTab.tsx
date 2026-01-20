import { useTranslation } from "react-i18next";
import cn from "classnames";
import { MoneyRecive, MoneySend } from "iconsax-react";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import type { GPHPayment } from "@/features/accounting/payroll";

interface Props {
  payment: GPHPayment;
  isFullScreen?: boolean;
}

type PaymentType = "worker" | "pension" | "tax" | "social";

interface PaymentOrder {
  id: string;
  type: PaymentType;
  amount: number;
  recipient: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  typeKey: string;
}

const typeColors: Record<PaymentType, { bg: string; text: string; border: string }> = {
  worker: { bg: "bg-positive-100", text: "text-positive-700", border: "border-positive-300" },
  pension: { bg: "bg-negative-100", text: "text-negative-700", border: "border-negative-300" },
  tax: { bg: "bg-primary-100", text: "text-primary-700", border: "border-primary-300" },
  social: { bg: "bg-notice-100", text: "text-notice-700", border: "border-notice-300" },
};

export default function PaymentTab({ payment, isFullScreen = false }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  const netAmount = toNumber(payment.net_amount);
  const opv = toNumber(payment.opv);
  const ipn = toNumber(payment.ipn);
  const vosms = toNumber(payment.vosms);
  const so = toNumber(payment.so);

  const paymentOrders: PaymentOrder[] = [
    {
      id: "GPH-001",
      type: "worker",
      typeKey: "paymentTypeContractor",
      amount: netAmount,
      recipient: payment.contractor_name,
      description: t("tabs.gph.contractorPayment"),
      debitAccount: "3350",
      creditAccount: "1030",
    },
    {
      id: "GPH-002",
      type: "pension",
      typeKey: "paymentTypePension",
      amount: opv,
      recipient: t("tabs.payment.enpf"),
      description: t("tabs.payment.opvDescription"),
      debitAccount: "3220",
      creditAccount: "1030",
    },
    {
      id: "GPH-003",
      type: "tax",
      typeKey: "paymentTypeTax",
      amount: ipn,
      recipient: t("tabs.payment.taxAuthority"),
      description: t("tabs.payment.ipnDescription"),
      debitAccount: "3120",
      creditAccount: "1030",
    },
    {
      id: "GPH-004",
      type: "social",
      typeKey: "paymentTypeSocial",
      amount: vosms,
      recipient: t("tabs.payment.fsms"),
      description: t("tabs.payment.vosmsDescription"),
      debitAccount: "3212",
      creditAccount: "1030",
    },
    {
      id: "GPH-005",
      type: "social",
      typeKey: "paymentTypeSocial",
      amount: so,
      recipient: t("tabs.payment.gfss"),
      description: t("tabs.payment.soDescription"),
      debitAccount: "3211",
      creditAccount: "1030",
    },
  ];

  const totals = {
    enpf: opv,
    tax: ipn,
    fsms: vosms,
    gfss: so,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <MoneyRecive size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.payment.outgoingPayments")}</span>
      </div>

      <div className={`grid gap-2 ${isFullScreen ? "grid-cols-3" : "grid-cols-1"}`}>
        {paymentOrders.map((order) => {
          const colors = typeColors[order.type];
          return (
            <div key={order.id} className="p-4 radius-sm border surface-base-stroke">
              <div className="flex items-center justify-between mb-3">
                <span className={cn("px-2 py-0.5 radius-xs text-body-bold-sm", colors.bg, colors.text)}>
                  {t(`tabs.payment.${order.typeKey}`)}
                </span>
                <span className="text-label-xs content-action-neutral">{order.id}</span>
              </div>

              <p className="text-display-2xs content-base-primary mb-1">{formatMoneyKzt(order.amount, locale)}</p>
              <p className="text-body-bold-md content-base-primary mb-2">{order.recipient}</p>
              <p className="text-label-sm content-action-neutral pb-4 border-b surface-base-stroke">
                {order.description}
              </p>

              <p className="text-label-sm content-action-neutral mt-4">
                {t("tabs.payment.debitCredit")} {order.debitAccount} / {t("tabs.payment.creditAccount")}{" "}
                {order.creditAccount}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <MoneySend size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.payment.wherePaymentsGo")}</span>
      </div>

      <div className={`grid gap-4 ${isFullScreen ? "grid-cols-4" : "grid-cols-1"}`}>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.enpfPension")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatMoneyKzt(totals.enpf, locale)}
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.gph.opvOnly")}</p>
        </div>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.taxAuthorityIPNSN")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatMoneyKzt(totals.tax, locale)}
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.gph.ipnOnly")}</p>
        </div>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.fsmsMedical")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatMoneyKzt(totals.fsms, locale)}
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.gph.vosmsOnly")}</p>
        </div>
        <div className="p-4 rounded-lg border surface-base-stroke">
          <p className="text-label-sm content-action-neutral mb-1">{t("tabs.payment.gfssSocial")}</p>
          <p className="text-display-2xs content-base-primary pb-3 border-b surface-base-stroke">
            {formatMoneyKzt(totals.gfss, locale)}
          </p>
          <p className="text-label-sm content-action-neutral mt-3">{t("tabs.payment.soOnly")}</p>
        </div>
      </div>
    </div>
  );
}

