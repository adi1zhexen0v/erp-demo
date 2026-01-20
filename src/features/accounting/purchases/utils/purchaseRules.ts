import {
  canEditDraftApprovedPaid,
  canApproveDraftApprovedPaid,
  canMarkPaidDraftApprovedPaid,
} from "@/features/accounting/shared";
import type { PurchaseStatus, PurchaseCategory } from "../types";

export function canEditPurchase(status: PurchaseStatus): boolean {
  return canEditDraftApprovedPaid(status);
}

export function canApprovePurchase(status: PurchaseStatus): boolean {
  return canApproveDraftApprovedPaid(status);
}

export function canMarkPaidPurchase(status: PurchaseStatus): boolean {
  return canMarkPaidDraftApprovedPaid(status);
}

export function shouldCreateWarehouseItem(category: PurchaseCategory): boolean {
  return category === "1330" || category === "2410" || category === "2730";
}

export function getPurchasesAvailableActions(status: PurchaseStatus): string[] {
  switch (status) {
    case "draft":
      return ["open", "approve", "delete"];
    case "approved":
      return ["open", "markPaid"];
    case "paid":
      return ["open"];
    default:
      return ["open"];
  }
}


