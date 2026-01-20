import { formatDateForDisplay } from "@/shared/utils";
import type { AnnualLeaveResponse, UnpaidLeaveResponse, MedicalLeaveResponse } from "../types";

export interface OverlappingLeave {
  leave: AnnualLeaveResponse | UnpaidLeaveResponse | MedicalLeaveResponse;
  leaveType: "annual" | "unpaid" | "medical";
  isConfirmed: boolean;
}

export function checkDateOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  const s1 = new Date(start1);
  s1.setHours(0, 0, 0, 0);
  const e1 = new Date(end1);
  e1.setHours(23, 59, 59, 999);

  const s2 = new Date(start2);
  s2.setHours(0, 0, 0, 0);
  const e2 = new Date(end2);
  e2.setHours(23, 59, 59, 999);

  return s1 <= e2 && s2 <= e1;
}

export function isLeaveStatusConfirmed(status: string): boolean {
  return status === "app_approved" || status === "active" || status === "order_uploaded";
}

export function findOverlappingLeaves(
  workerId: number,
  startDate: Date | undefined,
  endDate: Date | undefined,
  annualLeaves: AnnualLeaveResponse[] | undefined,
  unpaidLeaves: UnpaidLeaveResponse[] | undefined,
  medicalLeaves: MedicalLeaveResponse[] | undefined,
): OverlappingLeave[] {
  if (!startDate || !endDate) {
    return [];
  }

  const overlapping: OverlappingLeave[] = [];

  if (annualLeaves) {
    annualLeaves
      .filter((leave) => leave.worker.id === workerId)
      .forEach((leave) => {
        const leaveStart = new Date(leave.start_date);
        const leaveEnd = new Date(leave.end_date);
        if (checkDateOverlap(startDate, endDate, leaveStart, leaveEnd)) {
          overlapping.push({
            leave,
            leaveType: "annual",
            isConfirmed: isLeaveStatusConfirmed(leave.status),
          });
        }
      });
  }

  if (unpaidLeaves) {
    unpaidLeaves
      .filter((leave) => leave.worker.id === workerId)
      .forEach((leave) => {
        const leaveStart = new Date(leave.start_date);
        const leaveEnd = new Date(leave.end_date);
        if (checkDateOverlap(startDate, endDate, leaveStart, leaveEnd)) {
          overlapping.push({
            leave,
            leaveType: "unpaid",
            isConfirmed: isLeaveStatusConfirmed(leave.status),
          });
        }
      });
  }

  if (medicalLeaves) {
    medicalLeaves
      .filter((leave) => leave.worker.id === workerId)
      .forEach((leave) => {
        const leaveStart = new Date(leave.start_date);
        const leaveEnd = new Date(leave.end_date);
        if (checkDateOverlap(startDate, endDate, leaveStart, leaveEnd)) {
          overlapping.push({
            leave,
            leaveType: "medical",
            isConfirmed: isLeaveStatusConfirmed(leave.status),
          });
        }
      });
  }

  return overlapping;
}

export function formatLeavePeriod(startDate: string, endDate: string): string {
  const start = formatDateForDisplay(startDate);
  const end = formatDateForDisplay(endDate);
  return `${start} - ${end}`;
}

export function hasAnyLeavesForWorker(
  workerId: number,
  annualLeaves?: AnnualLeaveResponse[],
  unpaidLeaves?: UnpaidLeaveResponse[],
  medicalLeaves?: MedicalLeaveResponse[],
): boolean {
  if (annualLeaves && annualLeaves.some((leave) => leave.worker.id === workerId)) {
    return true;
  }
  if (unpaidLeaves && unpaidLeaves.some((leave) => leave.worker.id === workerId)) {
    return true;
  }
  if (medicalLeaves && medicalLeaves.some((leave) => leave.worker.id === workerId)) {
    return true;
  }
  return false;
}

export function getActiveLeavesForWorker(
  workerId: number,
  annualLeaves?: AnnualLeaveResponse[],
  unpaidLeaves?: UnpaidLeaveResponse[],
  medicalLeaves?: MedicalLeaveResponse[],
): OverlappingLeave[] {
  const activeLeaves: OverlappingLeave[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (annualLeaves) {
    annualLeaves
      .filter((leave) => {
        if (leave.worker.id !== workerId) return false;
        const leaveEnd = new Date(leave.end_date);
        leaveEnd.setHours(23, 59, 59, 999);
        return leaveEnd >= today;
      })
      .forEach((leave) => {
        activeLeaves.push({
          leave,
          leaveType: "annual",
          isConfirmed: isLeaveStatusConfirmed(leave.status),
        });
      });
  }

  if (unpaidLeaves) {
    unpaidLeaves
      .filter((leave) => {
        if (leave.worker.id !== workerId) return false;
        const leaveEnd = new Date(leave.end_date);
        leaveEnd.setHours(23, 59, 59, 999);
        return leaveEnd >= today;
      })
      .forEach((leave) => {
        activeLeaves.push({
          leave,
          leaveType: "unpaid",
          isConfirmed: isLeaveStatusConfirmed(leave.status),
        });
      });
  }

  if (medicalLeaves) {
    medicalLeaves
      .filter((leave) => {
        if (leave.worker.id !== workerId) return false;
        const leaveEnd = new Date(leave.end_date);
        leaveEnd.setHours(23, 59, 59, 999);
        return leaveEnd >= today;
      })
      .forEach((leave) => {
        activeLeaves.push({
          leave,
          leaveType: "medical",
          isConfirmed: isLeaveStatusConfirmed(leave.status),
        });
      });
  }

  return activeLeaves;
}
