import { useTranslation } from "react-i18next";
import {
  DocumentText1,
  Hashtag,
  Car,
  Building4,
  Calendar,
  MoneyRecive,
  PercentageSquare,
  Profile,
  TickCircle,
  Status,
} from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Badge, Skeleton } from "@/shared/ui";
import { formatMoneyKzt , formatDateForDisplay, toNumber } from "@/shared/utils";
import { getDraftApprovedPaidStatusConfig, RENTAL_PAYMENT_STATUS_LABEL_KEYS, formatPercentageFromRate } from "@/features/accounting/shared";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { useScrollDetection } from "@/shared/hooks/useScrollDetection";
import { useGetRentalPaymentQuery } from "../../../api";

interface Props {
  paymentId: number;
  onClose: () => void;
}

export default function PaymentDetailsModal({ paymentId, onClose }: Props) {
  const { t, i18n } = useTranslation("RentalsPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";
  const { data: payment, isLoading } = useGetRentalPaymentQuery(paymentId);
  const { scrollRef } = useScrollDetection();

  if (isLoading || !payment) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <Skeleton height={28} width={200} />
          </div>
          <div ref={scrollRef} className="flex-1 overflow-auto min-h-0 p-1 pr-3 page-scroll">
            <div className="flex flex-col py-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={cn("py-3 flex items-center gap-3", index < 9 && "border-b surface-base-stroke")}>
                  <Skeleton height={16} width={16} />
                  <Skeleton height={16} width={120} />
                  <Skeleton height={16} width={150} className="ml-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t surface-base-stroke shrink-0">
            <Skeleton height={48} width="100%" />
          </div>
        </div>
      </ModalForm>
    );
  }

  const statusConfig = getDraftApprovedPaidStatusConfig(payment.status);

  const fields = [
    {
      key: "paymentNumber",
      label: t("modals.details.paymentNumber"),
      value: `#${payment.payment_number}`,
      isBadge: false as const,
      icon: Hashtag,
    },
    {
      key: "type",
      label: t("modals.details.type"),
      value: payment.rental_type_display,
      isBadge: false as const,
      icon: payment.rental_type === "vehicle" ? Car : Building4,
    },
    {
      key: "period",
      label: t("modals.details.period"),
      value: `${formatDateForDisplay(payment.period_start_date, false)} - ${formatDateForDisplay(payment.period_end_date, false)}`,
      isBadge: false as const,
      icon: Calendar,
    },
    {
      key: "status",
      label: t("modals.details.status"),
      value: t(RENTAL_PAYMENT_STATUS_LABEL_KEYS[payment.status]),
      isBadge: true as const,
      badgeConfig: statusConfig,
      icon: Status,
    },
    {
      key: "amountNet",
      label: t("modals.details.amountNet"),
      value: formatMoneyKzt(payment.amount_net, undefined, false),
      isBadge: false as const,
      icon: TengeCircleIcon,
    },
    {
      key: "vatAmount",
      label: t("modals.details.vatAmount"),
      value: formatMoneyKzt(payment.vat_amount, undefined, false),
      isBadge: false as const,
      icon: TengeCircleIcon,
    },
    {
      key: "amountTotal",
      label: t("modals.details.amountTotal"),
      value: formatMoneyKzt(payment.amount_total, undefined, false),
      isBadge: false as const,
      icon: TengeCircleIcon,
    },
    {
      key: "vatRate",
      label: t("modals.details.vatRate"),
      value: formatPercentageFromRate(toNumber(payment.vat_rate), locale),
      isBadge: false as const,
      icon: PercentageSquare,
    },
    {
      key: "avrNumber",
      label: t("modals.details.avrNumber"),
      value: payment.avr_number,
      isBadge: false as const,
      icon: DocumentText1,
    },
    {
      key: "avrDate",
      label: t("modals.details.avrDate"),
      value: formatDateForDisplay(payment.avr_date, false),
      isBadge: false as const,
      icon: Calendar,
    },
    {
      key: "vendor",
      label: t("modals.details.vendor"),
      value: payment.vendor_name,
      isBadge: false as const,
      icon: Profile,
    },
    {
      key: "vendorBin",
      label: t("modals.details.vendorBin"),
      value: payment.vendor_bin,
      isBadge: false as const,
      icon: Hashtag,
    },
    ...(payment.approved_at
      ? [
          {
            key: "approvedAt",
            label: t("modals.details.approvedAt"),
            value: `${formatDateForDisplay(payment.approved_at, false)}${payment.approved_by ? ` (${payment.approved_by.full_name})` : ""}`,
            isBadge: false as const,
            icon: TickCircle,
          },
        ]
      : []),
    ...(payment.paid_at
      ? [
          {
            key: "paidAt",
            label: t("modals.details.paidAt"),
            value: `${formatDateForDisplay(payment.paid_at, false)}${payment.paid_by ? ` (${payment.paid_by.full_name})` : ""}`,
            isBadge: false as const,
            icon: MoneyRecive,
          },
        ]
      : []),
  ].filter((field) => field.value);

  return (
    <ModalForm icon={DocumentText1} onClose={onClose} resize={false}>
      <div className="flex flex-col gap-6 h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
          <h4 className="text-display-2xs content-base-primary">{t("modals.details.title")}</h4>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto min-h-0 p-1 pr-3 page-scroll">
          <div className="flex flex-col py-4">
            <div className="flex flex-col">
              {fields.map((field, index, array) => {
                const IconComponent = field.icon;
                return (
                  <div
                    key={field.key}
                    className={cn(
                      "py-3 flex items-center gap-3",
                      index < array.length - 1 && "border-b surface-base-stroke",
                    )}>
                    {IconComponent && (
                      <span className="content-action-brand">
                        <IconComponent size={16} color="currentColor" />
                      </span>
                    )}
                    <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">
                      {field.label}
                    </span>
                    {field.isBadge && field.badgeConfig ? (
                      <Badge
                        variant="soft"
                        color={field.badgeConfig.color}
                        text={field.value}
                        icon={field.badgeConfig.icon}
                      />
                    ) : (
                      <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-1 pt-4 border-t surface-base-stroke shrink-0">
          <Button variant="secondary" size="lg" onClick={onClose} className="w-full">
            {t("modals.edit.cancel")}
          </Button>
        </div>
      </div>
    </ModalForm>
  );
}
