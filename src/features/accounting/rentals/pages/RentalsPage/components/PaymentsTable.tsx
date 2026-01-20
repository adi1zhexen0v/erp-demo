import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Car } from "iconsax-react";
import { Table, Badge, Button } from "@/shared/ui";
import { formatDateForDisplay , formatMoneyKzt } from "@/shared/utils";
import { getDraftApprovedPaidStatusConfig, RENTAL_PAYMENT_STATUS_LABEL_KEYS } from "@/features/accounting/shared";
import type { RentalPaymentListItem } from "../../../types";
import type { RentalPaymentSortKey, RentalPaymentSortConfig } from "../../../hooks";
import PaymentsActions from "./PaymentsActions";

interface Props {
  payments: RentalPaymentListItem[];
  onOpen: (id: number) => void;
  onEdit: (payment: RentalPaymentListItem) => void;
  onApprove: (id: number) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  sortConfig: RentalPaymentSortConfig | null;
  onSort: (key: RentalPaymentSortKey) => void;
  approvingId?: number | null;
  markingPaidId?: number | null;
  deletingId?: number | null;
  isAnyModalOpen?: boolean;
}

export default function PaymentsTable({
  payments,
  onOpen,
  onEdit,
  onApprove,
  onMarkPaid,
  onDelete,
  sortConfig,
  onSort,
  approvingId,
  markingPaidId,
  deletingId,
  isAnyModalOpen = false,
}: Props) {
  const { t } = useTranslation("RentalsPage");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex items-center gap-3">
        <div className="w-10 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
          <Car size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-bold-lg content-base-primary">{t("section.title")}</h3>
          <p className="text-body-regular-sm content-action-neutral">{t("section.subtitle")}</p>
        </div>
      </div>

      <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell>{t("table.paymentNumber")}</Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "type" ? sortConfig.direction : undefined}
              onSort={() => onSort("type")}>
              {t("table.type")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "period" ? sortConfig.direction : undefined}
              onSort={() => onSort("period")}>
              {t("table.period")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "amount" ? sortConfig.direction : undefined}
              onSort={() => onSort("amount")}>
              {t("table.amount")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
              onSort={() => onSort("status")}>
              {t("table.status")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "avr_date" ? sortConfig.direction : undefined}
              onSort={() => onSort("avr_date")}>
              {t("table.avrDate")}
            </Table.HeadCell>
            <Table.HeadCell className="w-24">{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {payments.map((payment, index) => {
            const statusConfig = getDraftApprovedPaidStatusConfig(payment.status);
            const isApproving = approvingId === payment.id;
            const isMarkingPaid = markingPaidId === payment.id;
            const isDeleting = deletingId === payment.id;

            return (
              <Table.Row key={payment.id}>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">#{payment.payment_number}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{payment.rental_type_display}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">
                    {formatDateForDisplay(payment.period_start_date, false)} -{" "}
                    {formatDateForDisplay(payment.period_end_date, false)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{formatMoneyKzt(payment.amount_total, undefined, false)}</span>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    variant="soft"
                    color={statusConfig.color}
                    text={t(RENTAL_PAYMENT_STATUS_LABEL_KEYS[payment.status])}
                    icon={statusConfig.icon}
                  />
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">
                    {formatDateForDisplay(payment.avr_date, false)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      isIconButton
                      onClick={() => onOpen(payment.id)}
                      className="w-8! radius-xs! p-0!"
                      disabled={isAnyModalOpen}>
                      <Eye size={16} color="currentColor" />
                    </Button>
                    <PaymentsActions
                      payment={payment}
                      onOpen={onOpen}
                      onEdit={onEdit}
                      onApprove={onApprove}
                      onMarkPaid={onMarkPaid}
                      onDelete={onDelete}
                      isApproving={isApproving}
                      isMarkingPaid={isMarkingPaid}
                      isDeleting={isDeleting}
                      isOpen={openDropdownId === payment.id}
                      onToggle={(isOpen) => {
                        setOpenDropdownId(isOpen ? payment.id : null);
                      }}
                      direction={index === payments.length - 1 ? "top" : "bottom"}
                      isAnyModalOpen={isAnyModalOpen}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Table>
    </div>
  );
}
