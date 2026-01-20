import { useMemo } from "react";
import type { SortConfig } from "@/shared/utils";
import { toggleSort as sharedToggleSort, toNumber } from "@/shared/utils";
import type { InventoryUnit } from "../types";

export type SortKey = "name" | "status" | "price" | "barcode" | "date";

export type { SortConfig };

export function useWarehouseSort(items: InventoryUnit[], sortConfig: SortConfig<SortKey> | null): InventoryUnit[] {
  return useMemo(() => {
    if (!sortConfig) {
      return items;
    }

    const { key, direction } = sortConfig;

    return [...items].sort((a, b) => {
      let cmp = 0;

      if (key === "name") {
        cmp = a.item_name.localeCompare(b.item_name);
      } else if (key === "status") {
        cmp = a.status.localeCompare(b.status);
      } else if (key === "price") {
        cmp = toNumber(a.unit_cost) - toNumber(b.unit_cost);
      } else if (key === "barcode") {
        cmp = a.barcode.localeCompare(b.barcode);
      } else if (key === "date") {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [items, sortConfig]);
}

export function toggleSort(currentSort: SortConfig<SortKey> | null, newKey: SortKey): SortConfig<SortKey> {
  return sharedToggleSort(currentSort, newKey);
}


