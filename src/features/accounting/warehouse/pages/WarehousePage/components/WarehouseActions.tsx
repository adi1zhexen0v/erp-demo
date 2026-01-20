import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreIcon } from "@/shared/assets/icons";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import type { InventoryUnit } from "../../../types";
import { getWarehouseAvailableActions } from "../../../utils";

interface Props {
  item: InventoryUnit;
  onAssign: (id: number) => void;
  onReturn: (id: number) => void;
  onWriteOff: (id: number) => void;
  assigningId?: number | null;
  writingOffId?: number | null;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  direction?: "top" | "bottom";
}

export default function WarehouseActions({
  item,
  onAssign,
  onReturn,
  onWriteOff,
  assigningId,
  writingOffId,
  isOpen: controlledOpen,
  onToggle,
  direction = "bottom",
}: Props) {
  const { t } = useTranslation("WarehousePage");
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

  const availableActions = getWarehouseAvailableActions(item.asset_type, item.status);
  const actionsWithoutOpen = availableActions.filter((action) => action !== "open");
  const isAssigning = assigningId === item.id;
  const isWritingOff = writingOffId === item.id;
  const isAnyLoading = isAssigning || isWritingOff;

  if (actionsWithoutOpen.length === 0) {
    return null;
  }

  function handleAction(action: () => void) {
    action();
    setIsOpen(false);
  }

  return (
    <Dropdown open={isOpen && !isAnyLoading} onClose={() => setIsOpen(false)} direction={direction}>
      <Button
        variant="secondary"
        isIconButton
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        disabled={isAnyLoading}
        className="w-8! radius-xs! p-0!">
        <MoreIcon />
      </Button>

      {availableActions.includes("assign") && (
        <DropdownItem onClick={() => handleAction(() => onAssign(item.id))} disabled={isAssigning}>
          {isAssigning ? t("loading") : t("actions.assign")}
        </DropdownItem>
      )}

      {availableActions.includes("return") && (
        <DropdownItem onClick={() => handleAction(() => onReturn(item.id))}>{t("actions.return")}</DropdownItem>
      )}

      {availableActions.includes("writeOff") && (
        <DropdownItem onClick={() => handleAction(() => onWriteOff(item.id))} disabled={isWritingOff}>
          {isWritingOff ? t("loading") : t("actions.writeOff")}
        </DropdownItem>
      )}
    </Dropdown>
  );
}

