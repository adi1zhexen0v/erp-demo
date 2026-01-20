import type { AssetType, ItemStatus, TransactionStatus, FixedAssetGroup, MovementType } from "./domain";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface VendorResponse {
  id: number;
  name: string;
  bin: string | null;
  display_name: string;
  is_active: boolean;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVendorDto {
  name: string;
  bin?: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface UpdateVendorDto {
  name?: string;
  bin?: string;
  address?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface InventoryUnitListItem {
  id: number;
  barcode: string;
  serial_number: string;
  item_name: string;
  asset_type: AssetType;
  asset_type_display: string;
  fixed_asset_group?: FixedAssetGroup | null;
  fixed_asset_group_display?: string | null;
  vendor?: VendorResponse | null;
  status: ItemStatus;
  status_display: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  assigned_date: string | null;
  assignment_document: string;
  unit_cost: string;
  residual_value: string;
  is_fully_depreciated: boolean;
}

export interface InventoryUnit {
  id: number;
  inventory_item: number;
  item_name: string;
  asset_type: AssetType;
  asset_type_display: string;
  fixed_asset_group?: FixedAssetGroup | null;
  fixed_asset_group_display?: string | null;
  vendor?: VendorResponse | null;
  barcode: string;
  serial_number: string;
  status: ItemStatus;
  status_display: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  assigned_date: string | null;
  assignment_document: string;
  unit_cost: string;
  depreciation_rate: string;
  accumulated_depreciation: string;
  residual_value: string;
  last_depreciation_date: string | null;
  next_depreciation_date: string | null;
  is_depreciable: boolean;
  is_fully_depreciated: boolean;
  monthly_depreciation_amount: string;
  months_until_fully_depreciated: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryItemResponse {
  id: number;
  internal_id: string;
  barcode: string | null;
  name: string;
  description?: string;
  asset_type: AssetType;
  asset_type_display: string;
  fixed_asset_group?: FixedAssetGroup;
  fixed_asset_group_display?: string;
  account_code: string;
  status: ItemStatus;
  status_display: string;
  transaction_status: TransactionStatus;
  transaction_status_display: string;
  purchase_batch_id: string;
  unit_price: string;
  quantity: number;
  unit: string;
  vat_rate: string;
  vat_amount: string;
  total_cost: string;
  delivery_cost: string;
  delivery_vat: string;
  total_with_delivery: string;
  vendor: VendorResponse;
  invoice_number?: string;
  invoice_date?: string;
  receipt_date?: string;
  useful_life_months?: number;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  assigned_date?: string | null;
  assignment_document?: string;
  is_depreciable: boolean;
  is_fully_depreciated: boolean;
  units: InventoryUnitListItem[];
  created_at: string;
  updated_at: string;
}

export interface InventoryItemListItem {
  id: number;
  internal_id: string;
  barcode: string | null;
  name: string;
  asset_type: AssetType;
  asset_type_display: string;
  status: ItemStatus;
  status_display: string;
  transaction_status: TransactionStatus;
  transaction_status_display: string;
  purchase_batch_id: string;
  unit_price: string;
  quantity: number;
  total_with_delivery: string;
  vendor_name: string;
  is_depreciable: boolean;
  is_fully_depreciated: boolean;
  units_count: number;
  invoice_number?: string;
  invoice_date?: string;
  created_at: string;
}

export interface AssetAssignmentResponse {
  id: number;
  inventory_item: number;
  item_name: string;
  item_barcode?: string;
  item_internal_id?: string;
  employee: number;
  employee_name: string;
  assigned_by?: number;
  assigned_by_name?: string;
  document_number: string;
  assignment_date: string;
  quantity: number;
  notes?: string;
  is_returned: boolean;
  return_date?: string | null;
  return_notes?: string;
  created_at: string;
}

export interface InventoryMovementResponse {
  id: number;
  inventory_item: number;
  item_name: string;
  item_internal_id?: string;
  movement_type: MovementType;
  movement_type_display: string;
  movement_date: string;
  quantity_change: number;
  amount: string;
  description: string;
  old_status?: ItemStatus;
  new_status?: ItemStatus;
  old_value?: string;
  new_value?: string;
  performed_by?: number;
  performed_by_name?: string;
  journal_entry?: number;
  assignment?: number | null;
  created_at: string;
}

export interface OCRResponse {
  vendor_name: string;
  vendor_bin?: string;
  document_number?: string;
  document_date?: string;
  items: OCRItem[];
  subtotal: string;
  vat_amount: string;
  total: string;
}

export interface OCRItem {
  name: string;
  unit: string;
  quantity: number;
  unit_price: string;
  total_with_vat: string;
  vat_amount: string;
}

export interface AssignItemDto {
  employee_id: number;
  quantity?: number;
  notes?: string;
}

export interface ReturnItemDto {
  notes?: string;
}

export interface DepreciationForecastItem {
  month: number;
  date: string;
  depreciation_amount: string;
  residual_value_before: string;
  residual_value_after: string;
}

export interface DepreciationForecast {
  unit_id: number;
  barcode: string;
  item_name: string;
  unit_cost: string;
  depreciation_rate: string;
  monthly_depreciation: string;
  current_residual_value: string;
  accumulated_depreciation: string;
  months_until_fully_depreciated: number;
  forecast: DepreciationForecastItem[];
}

export type PublicUnitInfo = InventoryUnit;

export interface WriteOffItemDto {
  reason: string;
  notes?: string;
}

export interface ReturnUnitResponse {
  success: boolean;
  unit: InventoryUnit;
  assignment: {
    id: number;
    is_returned: boolean;
    return_date: string;
  };
  message: string;
}

export interface WriteOffUnitResponse {
  success: boolean;
  unit: InventoryUnit;
  journal_entries: Array<{
    id: number;
    debit_account: string;
    credit_account: string;
    amount: string;
    description: string;
  }>;
  message: string;
}

export interface ReceiveItemDto {
  vendor_name: string;
  vendor_bin?: string;
  name: string;
  description?: string;
  asset_type: AssetType;
  fixed_asset_group?: FixedAssetGroup;
  unit_price: string;
  quantity?: number;
  unit?: string;
  vat_rate?: string;
  delivery_cost?: string;
  invoice_number?: string;
  invoice_date?: string;
  useful_life_months?: number;
  depreciation_rate?: string;
}

