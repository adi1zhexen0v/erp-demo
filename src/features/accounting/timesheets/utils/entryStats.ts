import type { TimesheetEntryResponse } from "../types";

export interface EntryStats {
  work_days: number;
  work_hours: number;
  annual_leave_days: number;
  medical_leave_days: number;
  overtime_hours: number;
}

export function getEntryStats(
  entry: TimesheetEntryResponse | undefined
): EntryStats {
  if (!entry) {
    return {
      work_days: 0,
      work_hours: 0,
      annual_leave_days: 0,
      medical_leave_days: 0,
      overtime_hours: 0,
    };
  }
  return {
    work_days: entry.work_days,
    work_hours: entry.work_hours,
    annual_leave_days: entry.annual_leave_days,
    medical_leave_days: entry.medical_leave_days,
    overtime_hours: entry.overtime_hours,
  };
}

