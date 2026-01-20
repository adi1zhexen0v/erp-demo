import { formatDateYYYYMMDD } from "@/shared/utils";
import type { RentalPaymentCreateRequest, RentalPaymentUpdateRequest, RentalType } from "../types";
import type { MonthPeriodData } from "./period";

export interface CreateRentalPaymentFormValues {
  rentalType: RentalType;
  vehicleRentalId?: number;
  premisesLeaseId?: number;
  vendorId?: number;
  periodData: MonthPeriodData;
  description?: string;
  amountTotal: string;
  avrNumber: string;
  avrDate: Date;
}

export function buildCreateRentalPaymentDto(values: CreateRentalPaymentFormValues): RentalPaymentCreateRequest {
  const dto: RentalPaymentCreateRequest = {
    rental_type: values.rentalType,
    period: values.periodData.period,
    period_start_date: formatDateYYYYMMDD(values.periodData.period_start_date),
    period_end_date: formatDateYYYYMMDD(values.periodData.period_end_date),
    amount_total: values.amountTotal,
    avr_number: values.avrNumber,
    avr_date: formatDateYYYYMMDD(values.avrDate),
  };

  if (values.rentalType === "vehicle" && values.vehicleRentalId) {
    dto.vehicle_rental_id = values.vehicleRentalId;
  } else if (values.rentalType === "premises" && values.premisesLeaseId) {
    dto.premises_lease_id = values.premisesLeaseId;
  }

  if (values.vendorId) {
    dto.vendor_id = values.vendorId;
  }

  if (values.description?.trim()) {
    dto.description = values.description.trim();
  }

  return dto;
}

export interface UpdateRentalPaymentFormValues {
  periodStartDate: Date;
  periodEndDate: Date;
  period: string;
  amountTotal: string;
  vatRate: string;
  avrNumber: string;
  avrDate: Date;
}

export function buildUpdateRentalPaymentDto(values: UpdateRentalPaymentFormValues): RentalPaymentUpdateRequest {
  return {
    period_start_date: formatDateYYYYMMDD(values.periodStartDate),
    period_end_date: formatDateYYYYMMDD(values.periodEndDate),
    period: values.period,
    amount_total: values.amountTotal,
    vat_rate: values.vatRate,
    avr_number: values.avrNumber,
    avr_date: formatDateYYYYMMDD(values.avrDate),
  };
}

