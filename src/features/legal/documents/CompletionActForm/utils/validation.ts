import { z } from "zod";
import i18n from "i18next";
import { formatDateForDisplay, formatMoneyKzt } from "@/shared/utils";
import type { ServiceContractServiceItem } from "../../ServiceContractForm/types";
import type { CompletionActListItem } from "../types";

function getValidationMessage(key: string, params?: Record<string, string>): string {
  try {
    const resource = i18n.getResourceBundle(i18n.language, "LegalApplicationsPage");
    let message = resource?.completionAct?.validation?.[key] || "";
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        message = message.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    return message || key;
  } catch {
    return key;
  }
}

export const completionActSchema = z
  .object({
    parent_contract: z.number({ error: getValidationMessage("selectContract") }),
    service_item: z.number({ error: getValidationMessage("selectService") }).nullable(),
    period_start_date: z.date({ error: getValidationMessage("specifyStartDate") }).nullable(),
    period_end_date: z.date({ error: getValidationMessage("specifyEndDate") }).nullable(),
    amount: z
      .string({ error: getValidationMessage("specifyAmount") })
      .min(1, getValidationMessage("specifyAmount"))
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, getValidationMessage("amountMustBeGreaterThanZero")),
    description: z.string().default(""),
  })
  .refine((data) => data.service_item !== null, {
    message: getValidationMessage("selectService"),
    path: ["service_item"],
  })
  .refine((data) => data.period_start_date !== null, {
    message: getValidationMessage("specifyStartDate"),
    path: ["period_start_date"],
  })
  .refine((data) => data.period_end_date !== null, {
    message: getValidationMessage("specifyEndDate"),
    path: ["period_end_date"],
  })
  .refine(
    (data) => {
      if (data.period_start_date && data.period_end_date) {
        return data.period_end_date >= data.period_start_date;
      }
      return true;
    },
    {
      message: getValidationMessage("endDateBeforeStartDate"),
      path: ["period_end_date"],
    },
  );

export function createCompletionActSchemaWithContext(
  selectedService: ServiceContractServiceItem | null,
  existingActs: CompletionActListItem[] = [],
  currentActId?: number,
) {
  return completionActSchema
    .superRefine((data, ctx) => {
      if (selectedService && data.period_start_date) {
        const serviceStartDate = new Date(selectedService.start_date);
        serviceStartDate.setHours(0, 0, 0, 0);
        const actStartDate = new Date(data.period_start_date);
        actStartDate.setHours(0, 0, 0, 0);
        if (actStartDate < serviceStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getValidationMessage("startDateBeforeServiceStart", {
              date: formatDateForDisplay(serviceStartDate),
            }),
            path: ["period_start_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.period_start_date) {
        const serviceEndDate = new Date(selectedService.end_date);
        serviceEndDate.setHours(23, 59, 59, 999);
        const actStartDate = new Date(data.period_start_date);
        actStartDate.setHours(0, 0, 0, 0);
        if (actStartDate > serviceEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getValidationMessage("startDateAfterServiceEnd", {
              date: formatDateForDisplay(serviceEndDate),
            }),
            path: ["period_start_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.period_end_date) {
        const serviceStartDate = new Date(selectedService.start_date);
        serviceStartDate.setHours(0, 0, 0, 0);
        const actEndDate = new Date(data.period_end_date);
        actEndDate.setHours(0, 0, 0, 0);
        if (actEndDate < serviceStartDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getValidationMessage("endDateBeforeServiceStart", {
              date: formatDateForDisplay(serviceStartDate),
            }),
            path: ["period_end_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.period_end_date) {
        const serviceEndDate = new Date(selectedService.end_date);
        serviceEndDate.setHours(23, 59, 59, 999);
        const actEndDate = new Date(data.period_end_date);
        actEndDate.setHours(0, 0, 0, 0);
        if (actEndDate > serviceEndDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getValidationMessage("endDateAfterServiceEnd", {
              date: formatDateForDisplay(serviceEndDate),
            }),
            path: ["period_end_date"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      if (selectedService && data.service_item) {
        // Рассчитываем использованную сумму для выбранного сервиса
        const usedAmount = existingActs
          .filter((act) => act.service_item.id === data.service_item && act.id !== currentActId)
          .reduce((sum, act) => sum + parseFloat(act.amount || "0"), 0);

        const servicePrice = parseFloat(selectedService.price);
        const remainingAmount = servicePrice - usedAmount;
        const requestedAmount = parseFloat(data.amount || "0");

        if (requestedAmount > remainingAmount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getValidationMessage("exceededRemainder", {
              amount: formatMoneyKzt(remainingAmount),
            }),
            path: ["amount"],
          });
        }
      }
    });
}

export const rejectReasonSchema = z.object({
  reason: z
    .string({ error: getValidationMessage("specifyRejectionReason") })
    .min(10, getValidationMessage("reasonMinLength")),
});

export type CompletionActSchemaType = z.infer<typeof completionActSchema>;
export type RejectReasonSchemaType = z.infer<typeof rejectReasonSchema>;
