import type { PayrollStatus } from "../../payroll/types";
import type { PurchaseStatus } from "../../purchases/types";
import type { RentalPaymentStatus } from "../../rentals/types";

export const PAYROLL_STATUS_LABEL_KEYS: Record<PayrollStatus, string> = {
  draft: "status.draft",
  calculated: "status.calculated",
  approved: "status.approved",
  paid: "status.paid",
};

export const PURCHASE_STATUS_LABEL_KEYS: Record<PurchaseStatus, string> = {
  draft: "status.draft",
  approved: "status.approved",
  paid: "status.paid",
};

export const RENTAL_PAYMENT_STATUS_LABEL_KEYS: Record<RentalPaymentStatus, string> = {
  draft: "status.draft",
  approved: "status.approved",
  paid: "status.paid",
};

