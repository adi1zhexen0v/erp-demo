import { useTranslation } from "react-i18next";
import cn from "classnames";
import { MoneyRecive } from "iconsax-react";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import type { GroupedPurchase } from "../../../types";

interface Props {
  purchase: GroupedPurchase;
  isFullScreen: boolean;
}

export default function PurchasePaymentSection({ purchase, isFullScreen }: Props) {
  const { t } = useTranslation("PurchasesPage");

  const totalAmount = toNumber(purchase.total_amount);
  const paymentId = `PAY-P-${purchase.purchase_batch_id || purchase.invoice_key || Date.now()}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <MoneyRecive size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("detail.payment.outgoingPayments")}</span>
      </div>

      <div className={`grid gap-2 ${isFullScreen ? "grid-cols-1" : "grid-cols-1"}`}>
        <div className="p-4 radius-sm border surface-base-stroke">
          <div className="flex items-center justify-between mb-3">
            <span className={cn("px-2 py-0.5 radius-xs text-body-bold-sm", "bg-primary-100 text-primary-700")}>
              {t("detail.payment.paymentTypeVendor")}
            </span>
            <span className="text-label-xs content-action-neutral">{paymentId}</span>
          </div>

          <p className="text-display-2xs content-base-primary mb-1">{formatMoneyKzt(totalAmount)}</p>
          <p className="text-body-bold-md content-base-primary mb-2">{purchase.vendor_name}</p>
          <p className="text-label-sm content-action-neutral pb-4 border-b surface-base-stroke">
            {t("detail.payment.paymentFor", { vendor: purchase.vendor_name })}
          </p>

          <p className="text-label-sm content-action-neutral mt-4">
            {t("detail.payment.debitCredit")} 3310 / {t("detail.payment.creditAccount")} 1030
          </p>
        </div>
      </div>
    </div>
  );
}
