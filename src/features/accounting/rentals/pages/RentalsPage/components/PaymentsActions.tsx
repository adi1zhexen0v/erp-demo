import { useTranslation } from "react-i18next";
import { MoreIcon } from "@/shared/assets/icons";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import {
  canEditDraftApprovedPaid,
  canApproveDraftApprovedPaid,
  canMarkPaidDraftApprovedPaid,
  canDeleteDraftApprovedPaid,
} from "@/features/accounting/shared";
import type { RentalPaymentListItem } from "../../../types";

interface Props {
  payment: RentalPaymentListItem;
  onOpen: (id: number) => void;
  onEdit: (payment: RentalPaymentListItem) => void;
  onApprove: (id: number) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  isApproving: boolean;
  isMarkingPaid: boolean;
  isDeleting: boolean;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  direction?: "top" | "bottom";
  isAnyModalOpen?: boolean;
}

export default function PaymentsActions({
  payment,
  onOpen: _onOpen,
  onEdit,
  onApprove,
  onMarkPaid,
  onDelete,
  isApproving,
  isMarkingPaid,
  isDeleting,
  isOpen,
  onToggle,
  direction = "bottom",
  isAnyModalOpen = false,
}: Props) {
  const { t } = useTranslation("RentalsPage");

  const canEdit = canEditDraftApprovedPaid(payment.status);
  const canApprove = canApproveDraftApprovedPaid(payment.status);
  const canMarkPaid = canMarkPaidDraftApprovedPaid(payment.status);
  const canDelete = canDeleteDraftApprovedPaid(payment.status);

  const hasAnyAction = canEdit || canApprove || canMarkPaid || canDelete;

  if (isAnyModalOpen || !hasAnyAction) {
    return null;
  }

  return (
    <Dropdown
      open={isOpen}
      onClose={() => onToggle(false)}
      width="w-max"
      direction={direction}>
      <Button
        variant="secondary"
        isIconButton
        onClick={(e) => {
          e.stopPropagation();
          onToggle(!isOpen);
        }}
        className="w-8! radius-xs! p-0!">
        <MoreIcon />
      </Button>
      {canEdit && (
        <DropdownItem onClick={() => onEdit(payment)}>
          {t("table.actionItems.edit")}
        </DropdownItem>
      )}
      {canApprove && (
        <DropdownItem onClick={() => onApprove(payment.id)} disabled={isApproving}>
          {isApproving ? t("table.actionItems.approving") : t("table.actionItems.approve")}
        </DropdownItem>
      )}
      {canMarkPaid && (
        <DropdownItem onClick={() => onMarkPaid(payment.id)} disabled={isMarkingPaid}>
          {isMarkingPaid ? t("table.actionItems.markingPaid") : t("table.actionItems.markPaid")}
        </DropdownItem>
      )}
      {canDelete && (
        <DropdownItem onClick={() => onDelete(payment.id)} disabled={isDeleting} className="text-negative-500">
          {isDeleting ? t("table.actionItems.deleting") : t("table.actionItems.delete")}
        </DropdownItem>
      )}
    </Dropdown>
  );
}

