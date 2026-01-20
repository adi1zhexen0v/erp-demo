export type RentalPaymentStatus = "draft" | "approved" | "paid";

export type RentalType = "vehicle" | "premises";

export interface RentalPaymentParentContract {
  id: number;
  contract_number: string;
  contract_date: string;
  monthly_rent: string;
}

export interface RentalPaymentOrganization {
  id: number;
  name: string;
  bin: string;
}

export interface RentalPaymentVendor {
  id: number | null;
  name: string;
  bin: string;
  phone: string;
  bank_name: string;
  iban: string;
}

export interface RentalPaymentUser {
  id: number;
  full_name: string;
}

export interface RentalPayment {
  id: number;
  rental_type: RentalType;
  rental_type_display: string;
  vehicle_rental: number | null;
  premises_lease: number | null;
  parent_contract: RentalPaymentParentContract;
  organization: RentalPaymentOrganization;
  payment_number: number;
  period_start_date: string;
  period_end_date: string;
  period_description: string;
  period?: string;
  description?: string;
  amount_net: string;
  vat_rate: string;
  vat_amount: string;
  amount_total: string;
  avr_number: string;
  avr_date: string;
  avr_document_file: string;
  vendor_name: string;
  vendor_bin: string;
  vendor: RentalPaymentVendor | null;
  status: RentalPaymentStatus;
  status_display: string;
  can_approve: boolean;
  can_mark_paid: boolean;
  approved_at: string | null;
  approved_by: RentalPaymentUser | null;
  paid_at: string | null;
  paid_by: RentalPaymentUser | null;
  created_at: string;
  created_by: RentalPaymentUser | null;
}

export interface RentalPaymentListItem {
  id: number;
  rental_type: RentalType;
  rental_type_display: string;
  payment_number: number;
  period_description: string;
  period_start_date: string;
  period_end_date: string;
  amount_total: string;
  status: RentalPaymentStatus;
  status_display: string;
  avr_number: string;
  avr_date: string;
  vendor_name: string;
  vehicle_rental: number | null;
  premises_lease: number | null;
}

export interface RentalPaymentCreateRequest {
  rental_type: RentalType;
  vehicle_rental_id?: number;
  premises_lease_id?: number;
  vendor_id?: number;
  period?: string;
  period_start_date: string;
  period_end_date: string;
  period_description?: string;
  description?: string;
  amount_total: string;
  vat_rate?: string;
  avr_number: string;
  avr_date: string;
}

export interface RentalPaymentUpdateRequest {
  period_start_date?: string;
  period_end_date?: string;
  period?: string;
  amount_total?: string;
  vat_rate?: string;
  avr_number?: string;
  avr_date?: string;
}

export interface RentalPaymentApproveRequest {
  note?: string;
}

export interface RentalPaymentApproveResponse {
  payment: RentalPayment;
  message: string;
}

export interface RentalPaymentMarkPaidResponse {
  payment: RentalPayment;
  message: string;
}

export interface RentalPaymentsListQueryParams {
  rental_type?: RentalType;
  status?: RentalPaymentStatus;
  start_date?: string;
  end_date?: string;
  vehicle_rental_id?: number;
  premises_lease_id?: number;
}

export interface RentalPaymentOCRResponse {
  vendor_name: string | null;
  vendor_bin: string | null;
  act_number: string | null;
  act_date: string | null;
  amount_total: string | null;
  description: string | null;
  error: string | null;
}

export interface BudgetLimitError {
  status: "error";
  code: 400;
  type: "BudgetLimitExceeded";
  message: string;
  details: {
    section: "admin" | "mto" | "direct";
    limit: string;
    spent: string;
    requested: string;
    available: string;
  };
  help: string;
}

