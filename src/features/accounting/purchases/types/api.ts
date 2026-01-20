import type { InventoryItemListItem, AssetType, TransactionStatus } from "../../warehouse/types";
import type { PurchaseStatus, PurchaseCategory } from "./domain";

export interface PurchaseListItem {
  id: number;
  vendor_name: string;
  vendor_bin?: string;
  document_number?: string;
  document_date?: string;
  category: PurchaseCategory;
  category_display: string;
  status: PurchaseStatus;
  status_display: string;
  total_amount: string;
  purchase_batch_id?: string;
  created_at: string;
  updated_at: string;
}

export function assetTypeToCategory(assetType: AssetType): PurchaseCategory {
  switch (assetType) {
    case "inventory":
      return "1330";
    case "fixed_asset":
      return "2410";
    case "intangible":
      return "2730";
    default:
      return "1330";
  }
}

export function transactionStatusToPurchaseStatus(status: TransactionStatus): PurchaseStatus {
  return status as PurchaseStatus;
}

export interface PurchaseDetailResponse {
  id: number;
  vendor_name: string;
  vendor_bin?: string;
  vendor_address?: string;
  document_number?: string;
  document_date?: string;
  category: PurchaseCategory;
  category_display: string;
  status: PurchaseStatus;
  status_display: string;
  items: PurchaseItem[];
  subtotal: string;
  vat_amount: string;
  total_amount: string;
  delivery_cost?: string;
  delivery_vat?: string;
  journal_entries?: JournalEntry[];
  payment_status?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unit_price: string;
  vat_rate: string;
  vat_amount: string;
  total_with_vat: string;
}

export interface JournalEntry {
  id: number;
  debit_account: string;
  credit_account: string;
  amount: string;
  description: string;
  entry_date: string;
}

export interface CreatePurchaseDto {
  vendor_name: string;
  vendor_bin?: string;
  vendor_address?: string;
  document_number?: string;
  document_date?: string;
  category: PurchaseCategory;
  items: CreatePurchaseItemDto[];
  delivery_cost?: string;
}

export interface CreatePurchaseItemDto {
  name: string;
  description?: string;
  category: PurchaseCategory;
  quantity: number;
  unit: string;
  unit_price: string;
  vat_rate: string;
  fixed_asset_group?: string;
  useful_life_months?: number;
  depreciation_rate?: string;
}

export interface ApprovePurchaseDto {
  purchase_batch_id: string;
}

export interface MarkPaidPurchaseDto {
  purchase_batch_id: string;
}

export interface GroupedPurchase {
  invoice_key: string;
  purchase_batch_id?: string;
  invoice_number?: string;
  invoice_date?: string;
  vendor_name: string;
  vendor_bin?: string;
  items: InventoryItemListItem[];
  total_amount: string;
  items_count: number;
  category: PurchaseCategory | "mixed";
  category_display: string;
  status: PurchaseStatus;
  status_display: string;
  created_at: string;
}

