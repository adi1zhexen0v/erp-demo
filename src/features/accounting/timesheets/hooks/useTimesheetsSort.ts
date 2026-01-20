import { useMemo } from "react";
import { toggleSort as sharedToggleSort, type SortConfig } from "@/shared/utils";
import type { TimesheetResponse } from "../types";

export type SortKey = "status" | "workDays" | "workHours" | "entries";

export type { SortConfig };

export function useTimesheetsSort(
  timesheets: TimesheetResponse[],
  sortConfig: SortConfig<SortKey> | null,
): TimesheetResponse[] {
  return useMemo(() => {
    if (!sortConfig) {
      return timesheets;
    }

    const { key, direction } = sortConfig;

    return [...timesheets].sort((a, b) => {
      let cmp = 0;

      if (key === "status") {
        const statusOrder = { draft: 0, approved: 1 };
        const aStatus = statusOrder[a.status] ?? -1;
        const bStatus = statusOrder[b.status] ?? -1;
        cmp = aStatus - bStatus;
      } else if (key === "workDays") {
        cmp = (a.sum_work_days ?? 0) - (b.sum_work_days ?? 0);
      } else if (key === "workHours") {
        cmp = (a.sum_work_hours ?? 0) - (b.sum_work_hours ?? 0);
      } else if (key === "entries") {
        cmp = (a.entries_count ?? 0) - (b.entries_count ?? 0);
      }

      return direction === "asc" ? cmp : -cmp;
    });
  }, [timesheets, sortConfig]);
}

export function toggleSort(currentSort: SortConfig<SortKey> | null, newKey: SortKey): SortConfig<SortKey> {
  return sharedToggleSort(currentSort, newKey);
}
