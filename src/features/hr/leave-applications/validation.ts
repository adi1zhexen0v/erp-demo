import { z } from "zod";
import type { LeaveType, AnnualLeaveResponse, UnpaidLeaveResponse, MedicalLeaveResponse } from "./types";
import { findOverlappingLeaves } from "./utils";

export function createLeaveSchema(
  leaveType: LeaveType,
  vacationDaysAvailable?: number,
  workerId?: number,
  annualLeaves?: AnnualLeaveResponse[],
  unpaidLeaves?: UnpaidLeaveResponse[],
  medicalLeaves?: MedicalLeaveResponse[],
) {
  return z
    .object({
      start_date: z
        .date({
          message: "leaveForm.start_date.error.required",
        })
        .refine(
          function (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
          },
          {
            message: "leaveForm.start_date.error.past",
            path: ["start_date"],
          },
        ),
      end_date: z
        .date({
          message: "leaveForm.end_date.error.required",
        })
        .refine(
          function (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
          },
          {
            message: "leaveForm.end_date.error.past",
            path: ["end_date"],
          },
        ),
      reason: z.string().optional(),
      approval_resolution: z.enum(["approved", "recommend", "no_objection"]).optional().nullable(),
      diagnosis: z.string().optional(),
      certificate_required: z.boolean().optional(),
    })
    .refine(
      function (data) {
        return data.end_date > data.start_date;
      },
      {
        message: "leaveForm.end_date.error.before_start",
        path: ["end_date"],
      },
    )
    .refine(
      function (data) {
        if (leaveType === "annual" && vacationDaysAvailable !== undefined) {
          const diffTime = data.end_date.getTime() - data.start_date.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          const availableDays = Math.floor(vacationDaysAvailable);
          return diffDays <= availableDays;
        }
        return true;
      },
      {
        message: "leaveForm.end_date.error.exceeds_available",
        path: ["end_date"],
      },
    )
    .refine(
      function (data) {
        if (leaveType === "unpaid") {
          return data.reason && data.reason.trim().length > 0;
        }
        return true;
      },
      {
        message: "leaveForm.reason.error.required",
        path: ["reason"],
      },
    )
    .refine(
      function (data) {
        if (!workerId || !data.start_date || !data.end_date) {
          return true;
        }

        const relevantAnnualLeaves = leaveType === "annual" || leaveType === "unpaid" ? annualLeaves : undefined;
        const relevantUnpaidLeaves = leaveType === "annual" || leaveType === "unpaid" ? unpaidLeaves : undefined;
        const relevantMedicalLeaves = leaveType === "medical" ? medicalLeaves : undefined;

        const overlapping = findOverlappingLeaves(
          workerId,
          data.start_date,
          data.end_date,
          relevantAnnualLeaves,
          relevantUnpaidLeaves,
          relevantMedicalLeaves,
        );

        return overlapping.length === 0;
      },
      {
        message: "leaveForm.start_date.error.overlap",
        path: ["start_date"],
      },
    );
}

export type CreateLeaveFormValues = z.infer<ReturnType<typeof createLeaveSchema>>;

export function editLeaveSchema(leaveType: LeaveType) {
  return z
    .object({
      start_date: z
        .date({
          message: "leaveForm.start_date.error.required",
        })
        .refine(
          function (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
          },
          {
            message: "leaveForm.start_date.error.past",
            path: ["start_date"],
          },
        ),
      end_date: z
        .date({
          message: "leaveForm.end_date.error.required",
        })
        .refine(
          function (date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
          },
          {
            message: "leaveForm.end_date.error.past",
            path: ["end_date"],
          },
        ),
      reason: z.string().optional(),
      approval_resolution: z.enum(["approved", "recommend", "no_objection"]).optional().nullable(),
      diagnosis: z.string().optional(),
      certificate_required: z.boolean().optional(),
    })
    .refine(
      function (data) {
        return data.end_date > data.start_date;
      },
      {
        message: "leaveForm.end_date.error.before_start",
        path: ["end_date"],
      },
    )
    .refine(
      function (data) {
        if (leaveType === "unpaid") {
          return data.reason && data.reason.trim().length > 0;
        }
        return true;
      },
      {
        message: "leaveForm.reason.error.required",
        path: ["reason"],
      },
    );
}
