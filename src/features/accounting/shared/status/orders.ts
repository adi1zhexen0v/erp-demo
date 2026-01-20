import type { PayrollStatus } from "../../payroll/types";
import type { PurchaseStatus } from "../../purchases/types";
import type { RentalPaymentStatus } from "../../rentals/types";

export const PAYROLL_STATUS_ORDER: Record<PayrollStatus, number> = {
  draft: 0,
  calculated: 1,
  approved: 2,
  paid: 3,
};

export const PURCHASE_STATUS_ORDER: Record<PurchaseStatus, number> = {
  draft: 0,
  approved: 1,
  paid: 2,
};

export const RENTAL_PAYMENT_STATUS_ORDER: Record<RentalPaymentStatus, number> = {
  draft: 1,
  approved: 2,
  paid: 3,
};

