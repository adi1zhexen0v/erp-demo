import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Receipt } from "iconsax-react";
import { Table } from "@/shared/ui";
import { formatDateForDisplay } from "@/shared/utils";
import { formatMoneyKzt , getDraftApprovedPaidStatusConfig, PURCHASE_STATUS_LABEL_KEYS } from "@/features/accounting/shared";
import Badge from "@/shared/ui/Badge";
import type { GroupedPurchase } from "../../../types";
import type { SortKey, SortConfig } from "../../../hooks";
import PurchasesActions from "./PurchasesActions";

interface Props {
  purchases: GroupedPurchase[];
  onOpen: (invoiceKey: string) => void;
  onViewQuick: (invoiceKey: string) => void;
  onApprove: (invoiceKey: string) => void;
  onMarkPaid: (invoiceKey: string) => void;
  onDelete: (invoiceKey: string) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
  approvingKey?: string | null;
  markingPaidKey?: string | null;
  deletingKey?: string | null;
}

export default function PurchasesTable({
  purchases,
  onOpen,
  onViewQuick,
  onApprove,
  onMarkPaid,
  onDelete,
  sortConfig,
  onSort,
  approvingKey,
  markingPaidKey,
  deletingKey,
}: Props) {
  const { t } = useTranslation("PurchasesPage");
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex items-center gap-3">
        <div className="w-10 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
          <Receipt size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-bold-lg content-base-primary">{t("section.title")}</h3>
          <p className="text-body-regular-sm content-action-neutral">{t("section.subtitle")}</p>
        </div>
      </div>

      <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "invoice_number" ? sortConfig.direction : undefined}
              onSort={() => onSort("invoice_number")}>
              {t("table.invoiceNumber")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "vendor" ? sortConfig.direction : undefined}
              onSort={() => onSort("vendor")}>
              {t("table.vendor")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "date" ? sortConfig.direction : undefined}
              onSort={() => onSort("date")}>
              {t("table.date")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "items_count" ? sortConfig.direction : undefined}
              onSort={() => onSort("items_count")}>
              {t("table.itemsCount")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
              onSort={() => onSort("status")}>
              {t("table.status")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "amount" ? sortConfig.direction : undefined}
              onSort={() => onSort("amount")}>
              {t("table.amount")}
            </Table.HeadCell>
            <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {purchases.map((purchase, index) => {
            const statusConfig = getDraftApprovedPaidStatusConfig(purchase.status);
            const totalUnits = purchase.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <Table.Row key={purchase.invoice_key}>
                <Table.Cell>{purchase.invoice_number || "-"}</Table.Cell>
                <Table.Cell isBold>
                  <div className="flex flex-col gap-1">
                    <span>{purchase.vendor_name}</span>
                    {purchase.vendor_bin && (
                      <span className="text-label-xs content-action-neutral">
                        {t("table.vendorBin", { bin: purchase.vendor_bin })}
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>{purchase.created_at ? formatDateForDisplay(purchase.created_at) : "-"}</Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{totalUnits}</span>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    variant="soft"
                    color={statusConfig.color}
                    text={t(PURCHASE_STATUS_LABEL_KEYS[purchase.status])}
                    icon={statusConfig.icon}
                  />
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{formatMoneyKzt(purchase.total_amount)}</span>
                </Table.Cell>
                <Table.Cell>
                  <PurchasesActions
                    purchase={purchase}
                    onOpen={onOpen}
                    onViewQuick={onViewQuick}
                    onApprove={onApprove}
                    onMarkPaid={onMarkPaid}
                    onDelete={onDelete}
                    approvingKey={approvingKey}
                    markingPaidKey={markingPaidKey}
                    deletingKey={deletingKey}
                    isOpen={openDropdownKey === purchase.invoice_key}
                    onToggle={(isOpen) => {
                      setOpenDropdownKey(isOpen ? purchase.invoice_key : null);
                    }}
                    direction={index === purchases.length - 1 ? "top" : "bottom"}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Table>
    </div>
  );
}

