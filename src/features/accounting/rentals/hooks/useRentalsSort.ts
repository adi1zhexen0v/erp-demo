import { useMemo } from "react";
import { toNumber } from "@/shared/utils";
import { RENTAL_PAYMENT_STATUS_ORDER } from "@/features/accounting/shared";
import type { RentalPaymentListItem } from "../types";

export type RentalPaymentSortKey = "status" | "date" | "period" | "amount" | "vendor" | "type" | "avr_date";

export interface RentalPaymentSortConfig {
  key: RentalPaymentSortKey;
  direction: "asc" | "desc";
}


export function useRentalPaymentsSort(
  payments: RentalPaymentListItem[],
  sortConfig: RentalPaymentSortConfig | null,
): RentalPaymentListItem[] {
  return useMemo(() => {
    if (!sortConfig) {
      return payments;
    }

    const { key, direction } = sortConfig;

    return [...payments].sort((a, b) => {
      let cmp = 0;

      if (key === "status") {
        const aStatus = RENTAL_PAYMENT_STATUS_ORDER[a.status] ?? -1;
        const bStatus = RENTAL_PAYMENT_STATUS_ORDER[b.status] ?? -1;
        cmp = aStatus - bStatus;
      } else if (key === "date") {
        const aDate = new Date(a.avr_date).getTime();
        const bDate = new Date(b.avr_date).getTime();
        cmp = aDate - bDate;
      } else if (key === "period") {
        const aDate = new Date(a.period_start_date).getTime();
        const bDate = new Date(b.period_start_date).getTime();
        cmp = aDate - bDate;
      } else if (key === "amount") {
        cmp = toNumber(a.amount_total) - toNumber(b.amount_total);
      } else if (key === "vendor") {
        cmp = a.vendor_name.localeCompare(b.vendor_name);
      } else if (key === "type") {
        cmp = a.rental_type.localeCompare(b.rental_type);
      } else if (key === "avr_date") {
        const aDate = new Date(a.avr_date).getTime();
        const bDate = new Date(b.avr_date).getTime();
        cmp = aDate - bDate;
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [payments, sortConfig]);
}

export function toggleRentalPaymentSort(
  currentSort: RentalPaymentSortConfig | null,
  newKey: RentalPaymentSortKey,
): RentalPaymentSortConfig {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

