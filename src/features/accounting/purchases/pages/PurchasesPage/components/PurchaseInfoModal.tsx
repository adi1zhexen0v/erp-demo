import { useTranslation } from "react-i18next";
import { Eye, DocumentText, Wallet, Box1 } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Badge } from "@/shared/ui";
import { formatMoneyKzt , getDraftApprovedPaidStatusConfig, PURCHASE_STATUS_LABEL_KEYS } from "@/features/accounting/shared";
import { useScrollDetection } from "@/shared/hooks";
import type { GroupedPurchase } from "../../../types";


interface Props {
  purchase: GroupedPurchase | null;
  onClose: () => void;
}

export default function PurchaseInfoModal({ purchase, onClose }: Props) {
  const { t } = useTranslation("PurchasesPage");
  const { scrollRef, hasScroll } = useScrollDetection();

  if (!purchase) return null;

  const statusConfig = getDraftApprovedPaidStatusConfig(purchase.status);
  const totalUnits = purchase.items.reduce((sum, item) => sum + item.quantity, 0);

  const fields = [
    {
      key: "status",
      label: t("table.status"),
      value: t(PURCHASE_STATUS_LABEL_KEYS[purchase.status]),
      icon: DocumentText,
      isStatus: true,
    },
    {
      key: "amount",
      label: t("table.amount"),
      value: formatMoneyKzt(purchase.total_amount),
      icon: Wallet,
    },
  ];

  return (
    <ModalForm icon={Eye} onClose={onClose}>
      <div className="flex flex-col gap-5 h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
          <h4 className="text-display-2xs content-base-primary">
            {purchase.invoice_number
              ? t("detail.titleWithInvoice", { invoice: purchase.invoice_number })
              : t("detail.title", { vendor: purchase.vendor_name })}
          </h4>
        </div>

        <div ref={scrollRef} className={cn("flex-1 overflow-auto min-h-0 p-1 page-scroll", hasScroll && "pr-3")}>
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
                  <span className="content-action-brand">
                    <IconComponent size={16} color="currentColor" />
                  </span>
                  <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">
                    {field.label}
                  </span>
                  {field.isStatus ? (
                    <div className="flex justify-end">
                      <Badge variant="soft" color={statusConfig.color} text={field.value} icon={statusConfig.icon} />
                    </div>
                  ) : (
                    <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                  )}
                </div>
              );
            })}

            <div className="mt-4 p-5 radius-lg border surface-component-stroke flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-2 border-b surface-base-stroke">
                <div className="w-8 aspect-square surface-component-fill radius-xs flex items-center justify-center">
                  <span className="content-action-neutral">
                    <Box1 size={16} color="currentColor" />
                  </span>
                </div>
                <h5 className="text-body-bold-md content-base-primary">{t("table.itemsCount")}</h5>
              </div>
              <div className="flex flex-col gap-3">
                {purchase.items.map((item, itemIndex) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center">
                      <span className="text-body-regular-md content-base-primary">{item.name}</span>
                      <span className="text-body-bold-md content-base-primary">
                        {formatMoneyKzt(item.total_with_delivery)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-body-regular-sm content-base-secondary">
                        {item.quantity} {t("createModal.units.pcs")} × {formatMoneyKzt(item.unit_price)}
                      </span>
                    </div>
                    {itemIndex < purchase.items.length - 1 && (
                      <div className="pt-3 mt-3 border-t surface-base-stroke" />
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t surface-base-stroke mt-2">
                  <span className="text-body-regular-md content-base-primary font-medium">
                    {t("detail.total", { count: totalUnits })}:
                  </span>
                  <span className="text-body-bold-lg content-base-primary">{formatMoneyKzt(purchase.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalForm>
  );
}
