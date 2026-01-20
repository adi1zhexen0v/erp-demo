import type { ItemStatus, AssetType } from "../types";

export function canAssignItem(status: ItemStatus): boolean {
  return status === "in_stock";
}

export function canWriteOffItem(status: ItemStatus): boolean {
  return status === "in_stock" || status === "assigned";
}

export function canReturnItem(status: ItemStatus): boolean {
  return status === "assigned";
}

export function getWarehouseAvailableActions(assetType: AssetType, status: ItemStatus): string[] {
  const actions: string[] = ["open"];

  if (canAssignItem(status)) {
    actions.push("assign");
  }

  if (canReturnItem(status)) {
    actions.push("return");
  }

  if (canWriteOffItem(status)) {
    actions.push("writeOff");
  }

  return actions;
}


