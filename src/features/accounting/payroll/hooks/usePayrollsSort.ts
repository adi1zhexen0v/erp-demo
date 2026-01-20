import { useMemo } from "react";
import { toNumber, toggleSort as sharedToggleSort } from "@/shared/utils";
import { PAYROLL_STATUS_ORDER } from "@/features/accounting/shared";
import type { SortConfig } from "@/shared/utils";
import type { PayrollListResponse } from "../types";

export type SortKey = "status" | "period" | "workers" | "gross" | "net";

export type { SortConfig };

export function usePayrollsSort(payrolls: PayrollListResponse[], sortConfig: SortConfig<SortKey> | null): PayrollListResponse[] {
  return useMemo(() => {
    if (!sortConfig) {
      return payrolls;
    }

    const { key, direction } = sortConfig;

    return [...payrolls].sort((a, b) => {
      let cmp = 0;

      if (key === "status") {
        const aStatus = PAYROLL_STATUS_ORDER[a.status] ?? -1;
        const bStatus = PAYROLL_STATUS_ORDER[b.status] ?? -1;
        cmp = aStatus - bStatus;
      } else if (key === "period") {
        if (a.year !== b.year) {
          cmp = a.year - b.year;
        } else {
          cmp = a.month - b.month;
        }
      } else if (key === "workers") {
        cmp = a.worker_count - b.worker_count;
      } else if (key === "gross") {
        cmp = toNumber(a.total_gross_salary) - toNumber(b.total_gross_salary);
      } else if (key === "net") {
        cmp = toNumber(a.total_net_salary) - toNumber(b.total_net_salary);
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [payrolls, sortConfig]);
}

export function toggleSort(currentSort: SortConfig<SortKey> | null, newKey: SortKey): SortConfig<SortKey> {
  return sharedToggleSort(currentSort, newKey);
}

