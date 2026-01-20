import type { DailyData, TimesheetEntryResponse } from "../types";
import { DEFAULT_EDIT_NOTE } from "../consts";

export interface TimesheetUpdatePayload {
  id: number;
  dto: {
    daily_data: DailyData;
    edit_note: string;
  };
}

export function buildTimesheetUpdatePayload(
  pendingChanges: Map<number, DailyData>,
  entries: TimesheetEntryResponse[]
): TimesheetUpdatePayload[] {
  return Array.from(pendingChanges.entries()).map(([entryId, dailyData]) => {
    const entry = entries.find((e) => e.id === entryId);
    return {
      id: entryId,
      dto: {
        daily_data: dailyData,
        edit_note: entry?.is_manually_edited ? entry.edit_note : DEFAULT_EDIT_NOTE,
      },
    };
  });
}

