import type { EntryStats } from "./entryStats";

export interface Totals {
  work_days: number;
  work_hours: number;
  overtime_hours: number;
  annual_leave_days: number;
  medical_leave_days: number;
}

export function calculateTotals(statsArray: EntryStats[]): Totals {
  return statsArray.reduce(
    (acc, stats) => ({
      work_days: acc.work_days + stats.work_days,
      work_hours: acc.work_hours + stats.work_hours,
      overtime_hours: acc.overtime_hours + stats.overtime_hours,
      annual_leave_days: acc.annual_leave_days + stats.annual_leave_days,
      medical_leave_days: acc.medical_leave_days + stats.medical_leave_days,
    }),
    { work_days: 0, work_hours: 0, overtime_hours: 0, annual_leave_days: 0, medical_leave_days: 0 }
  );
}

