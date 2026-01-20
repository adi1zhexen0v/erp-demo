import { useMemo } from "react";
import { toggleSort as sharedToggleSort, toNumber } from "@/shared/utils";
import { PURCHASE_STATUS_ORDER } from "@/features/accounting/shared";
import type { SortConfig } from "@/shared/utils";
import type { GroupedPurchase } from "../types";

export type SortKey = "invoice_number" | "status" | "date" | "vendor" | "amount" | "category" | "items_count";

export type { SortConfig };

export function usePurchasesSort(
  purchases: GroupedPurchase[],
  sortConfig: SortConfig<SortKey> | null,
): GroupedPurchase[] {
  return useMemo(() => {
    if (!sortConfig) {
      return purchases;
    }

    const { key, direction } = sortConfig;

    return [...purchases].sort((a, b) => {
      let cmp = 0;

      if (key === "invoice_number") {
        const aInvoice = a.invoice_number || "";
        const bInvoice = b.invoice_number || "";
        cmp = aInvoice.localeCompare(bInvoice);
      } else if (key === "status") {
        const aStatus = PURCHASE_STATUS_ORDER[a.status] ?? -1;
        const bStatus = PURCHASE_STATUS_ORDER[b.status] ?? -1;
        cmp = aStatus - bStatus;
      } else if (key === "date") {
        const aDate = a.invoice_date ? new Date(a.invoice_date).getTime() : 0;
        const bDate = b.invoice_date ? new Date(b.invoice_date).getTime() : 0;
        cmp = aDate - bDate;
      } else if (key === "vendor") {
        cmp = a.vendor_name.localeCompare(b.vendor_name);
      } else if (key === "amount") {
        cmp = toNumber(a.total_amount) - toNumber(b.total_amount);
      } else if (key === "category") {
        const aCat = a.category === "mixed" ? "zzzz" : a.category;
        const bCat = b.category === "mixed" ? "zzzz" : b.category;
        cmp = aCat.localeCompare(bCat);
      } else if (key === "items_count") {
        cmp = a.items_count - b.items_count;
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [purchases, sortConfig]);
}

export function toggleSort(currentSort: SortConfig<SortKey> | null, newKey: SortKey): SortConfig<SortKey> {
  return sharedToggleSort(currentSort, newKey);
}
