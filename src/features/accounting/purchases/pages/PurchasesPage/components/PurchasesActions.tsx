import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Chart2 } from "iconsax-react";
import { MoreIcon } from "@/shared/assets/icons";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import type { GroupedPurchase } from "../../../types";
import { getPurchasesAvailableActions } from "../../../utils";

interface Props {
  purchase: GroupedPurchase;
  onOpen: (invoiceKey: string) => void;
  onViewQuick: (invoiceKey: string) => void;
  onApprove: (invoiceKey: string) => void;
  onMarkPaid: (invoiceKey: string) => void;
  onDelete: (invoiceKey: string) => void;
  approvingKey?: string | null;
  markingPaidKey?: string | null;
  deletingKey?: string | null;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  direction?: "top" | "bottom";
}

export default function PurchasesActions({
  purchase,
  onOpen,
  onViewQuick,
  onApprove,
  onMarkPaid,
  onDelete,
  approvingKey,
  markingPaidKey,
  deletingKey,
  isOpen: controlledOpen,
  onToggle,
  direction = "bottom",
}: Props) {
  const { t } = useTranslation("PurchasesPage");
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

  const availableActions = getPurchasesAvailableActions(purchase.status);
  const dropdownActions = availableActions.filter((a) => a !== "open");
  const hasDropdownActions = dropdownActions.length > 0;
  const isApproving = approvingKey === purchase.invoice_key;
  const isMarkingPaid = markingPaidKey === purchase.invoice_key;
  const isDeleting = deletingKey === purchase.invoice_key;
  const isAnyLoading = isApproving || isMarkingPaid || isDeleting;

  function handleOpenClick(e: React.MouseEvent) {
    e.stopPropagation();
    onOpen(purchase.invoice_key);
  }

  function handleViewQuickClick(e: React.MouseEvent) {
    e.stopPropagation();
    onViewQuick(purchase.invoice_key);
  }

  function handleDropdownToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  function handleAction(action: () => void) {
    action();
    setIsOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" isIconButton onClick={handleViewQuickClick} className="w-8! radius-xs! p-0!">
        <Eye size={16} color="currentColor" />
      </Button>
      <Button variant="secondary" isIconButton onClick={handleOpenClick} className="w-8! radius-xs! p-0!">
        <Chart2 size={16} color="currentColor" />
      </Button>
      {hasDropdownActions && (
        <Dropdown open={isOpen && !isAnyLoading} onClose={() => setIsOpen(false)} direction={direction}>
          <Button
            variant="secondary"
            isIconButton
            onClick={handleDropdownToggle}
            disabled={isAnyLoading}
            className="w-8! radius-xs! p-0!">
            <MoreIcon />
          </Button>

          {availableActions.includes("approve") && (
            <DropdownItem
              onClick={() => handleAction(() => onApprove(purchase.invoice_key))}
              disabled={isApproving}>
              {isApproving ? t("messages.loading") : t("actions.approve")}
            </DropdownItem>
          )}

          {availableActions.includes("markPaid") && (
            <DropdownItem
              onClick={() => handleAction(() => onMarkPaid(purchase.invoice_key))}
              disabled={isMarkingPaid}>
              {isMarkingPaid ? t("messages.loading") : t("actions.markPaid")}
            </DropdownItem>
          )}

          {availableActions.includes("delete") && (
            <DropdownItem
              onClick={() => handleAction(() => onDelete(purchase.invoice_key))}
              disabled={isDeleting}
              className="text-negative-500">
              {isDeleting ? t("messages.loading") : t("actions.delete")}
            </DropdownItem>
          )}
        </Dropdown>
      )}
    </div>
  );
}
