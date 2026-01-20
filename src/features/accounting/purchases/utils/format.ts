import { formatPrice } from "@/shared/utils";
import type { InventoryItemListItem } from "../../warehouse/types";

export function formatPurchaseAmount(item: InventoryItemListItem): string {
  return formatPrice(item.total_with_delivery);
}


