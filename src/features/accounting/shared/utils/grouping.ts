import { toNumber } from "@/shared/utils";
import type { InventoryItemListItem } from "../../warehouse/types";
import type { GroupedPurchase, PurchaseCategory, PurchaseStatus } from "../../purchases/types";
import { assetTypeToCategory, transactionStatusToPurchaseStatus } from "../../purchases/types/api";
import { PURCHASE_STATUS_ORDER } from "../status/orders";

function createInvoiceKey(item: InventoryItemListItem): string {
  if (!item.invoice_number) {
    return `single_${item.id}`;
  }
  return `${item.invoice_number}_${item.invoice_date || ""}_${item.vendor_name}`;
}

function determineGroupCategory(
  items: InventoryItemListItem[],
): { category: PurchaseCategory | "mixed"; display: string } {
  const categories = new Set(items.map((i) => assetTypeToCategory(i.asset_type)));

  if (categories.size === 1) {
    const first = items[0];
    return { category: assetTypeToCategory(first.asset_type), display: first.asset_type_display };
  }

  return { category: "mixed", display: "category.mixed" };
}

function determineGroupStatus(
  items: InventoryItemListItem[],
): { status: PurchaseStatus; display: string } {
  const sorted = [...items].sort((a, b) => {
    const statusA = transactionStatusToPurchaseStatus(a.transaction_status);
    const statusB = transactionStatusToPurchaseStatus(b.transaction_status);
    return PURCHASE_STATUS_ORDER[statusA] - PURCHASE_STATUS_ORDER[statusB];
  });
  const lowestStatus = sorted[0];
  return {
    status: transactionStatusToPurchaseStatus(lowestStatus.transaction_status),
    display: lowestStatus.transaction_status_display,
  };
}

function sumAmounts(items: InventoryItemListItem[]): string {
  const total = items.reduce((sum, item) => sum + toNumber(item.total_with_delivery), 0);
  return total.toFixed(2);
}

function areInSameTimeWindow(date1: string, date2: string): boolean {
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();
  const diffMinutes = Math.abs(time1 - time2) / (1000 * 60);
  return diffMinutes <= 1;
}

export function groupPurchasesByVendorAndTime(items: InventoryItemListItem[]): GroupedPurchase[] {
  if (items.length === 0) return [];

  const sortedItems = [...items].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const groups: InventoryItemListItem[][] = [];

  for (const item of sortedItems) {
    let foundGroup = false;
    for (const group of groups) {
      const firstInGroup = group[0];
      if (
        firstInGroup.vendor_name === item.vendor_name &&
        areInSameTimeWindow(firstInGroup.created_at, item.created_at)
      ) {
        group.push(item);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      groups.push([item]);
    }
  }

  const result: GroupedPurchase[] = [];

  for (const groupItems of groups) {
    const first = groupItems[0];
    const categoryInfo = determineGroupCategory(groupItems);
    const statusInfo = determineGroupStatus(groupItems);

    const timeKey = new Date(first.created_at).toISOString().slice(0, 16);
    const invoiceKey = `${first.vendor_name}_${timeKey}`;

    const purchaseBatchId = groupItems.every((item) => item.purchase_batch_id === first.purchase_batch_id)
      ? first.purchase_batch_id
      : undefined;

    result.push({
      invoice_key: invoiceKey,
      purchase_batch_id: purchaseBatchId,
      invoice_number: first.invoice_number,
      invoice_date: first.invoice_date,
      vendor_name: first.vendor_name,
      vendor_bin: undefined,
      items: groupItems,
      total_amount: sumAmounts(groupItems),
      items_count: groupItems.length,
      category: categoryInfo.category,
      category_display: categoryInfo.display,
      status: statusInfo.status,
      status_display: statusInfo.display,
      created_at: first.created_at,
    });
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function groupItemsByBatch(items: InventoryItemListItem[]): GroupedPurchase[] {
  const grouped = new Map<string, InventoryItemListItem[]>();

  for (const item of items) {
    const key = item.purchase_batch_id || createInvoiceKey(item);
    const existing = grouped.get(key) || [];
    existing.push(item);
    grouped.set(key, existing);
  }

  const result: GroupedPurchase[] = [];

  for (const [key, groupItems] of grouped) {
    const first = groupItems[0];
    const categoryInfo = determineGroupCategory(groupItems);
    const statusInfo = determineGroupStatus(groupItems);

    const invoiceKey = first.purchase_batch_id ? createInvoiceKey(first) : key;

    result.push({
      invoice_key: invoiceKey,
      purchase_batch_id: first.purchase_batch_id || undefined,
      invoice_number: first.invoice_number,
      invoice_date: first.invoice_date,
      vendor_name: first.vendor_name,
      vendor_bin: undefined,
      items: groupItems,
      total_amount: sumAmounts(groupItems),
      items_count: groupItems.length,
      category: categoryInfo.category,
      category_display: categoryInfo.display,
      status: statusInfo.status,
      status_display: statusInfo.display,
      created_at: first.created_at,
    });
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function groupPurchasesByInvoiceNumber(items: InventoryItemListItem[]): GroupedPurchase[] {
  if (items.length === 0) return [];

  const grouped = new Map<string, InventoryItemListItem[]>();

  for (const item of items) {
    const key = item.invoice_number || `no-invoice-${item.id}`;
    const existing = grouped.get(key) || [];
    existing.push(item);
    grouped.set(key, existing);
  }

  const result: GroupedPurchase[] = [];

  for (const [key, groupItems] of grouped) {
    const first = groupItems[0];
    const categoryInfo = determineGroupCategory(groupItems);
    const statusInfo = determineGroupStatus(groupItems);

    const invoiceKey = first.invoice_number ? `invoice-${first.invoice_number}` : key;

    result.push({
      invoice_key: invoiceKey,
      purchase_batch_id: groupItems.every((item) => item.purchase_batch_id === first.purchase_batch_id)
        ? first.purchase_batch_id
        : undefined,
      invoice_number: first.invoice_number,
      invoice_date: first.invoice_date,
      vendor_name: first.vendor_name,
      vendor_bin: undefined,
      items: groupItems,
      total_amount: sumAmounts(groupItems),
      items_count: groupItems.length,
      category: categoryInfo.category,
      category_display: categoryInfo.display,
      status: statusInfo.status,
      status_display: statusInfo.display,
      created_at: first.created_at,
    });
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const groupPurchasesByInvoice = groupItemsByBatch;

