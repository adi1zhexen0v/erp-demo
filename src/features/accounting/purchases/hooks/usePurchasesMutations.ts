import { useState } from "react";
import { useTranslation } from "react-i18next";
import { extractErrorMessage, toNumber } from "@/shared/utils";
import {
  useCreatePurchaseMutation,
  useApprovePurchaseMutation,
  useMarkPaidPurchaseMutation,
  useDeletePurchaseMutation,
  useExtractOCRMutation,
} from "../api";
import type { CreatePurchaseDto, ApprovePurchaseDto, MarkPaidPurchaseDto, PurchaseCategory } from "../types";
import type { ReceiveItemDto } from "../../warehouse/types";
import type { PromptState } from "./usePurchasesModals";

export interface UsePurchasesMutationsReturn {
  creating: boolean;
  approvingBatchId: string | null;
  markingPaidBatchId: string | null;
  deletingId: number | null;
  extractingOCR: boolean;
  isApproving: boolean;
  isMarkingPaid: boolean;
  isDeleting: boolean;
  handleCreate: (dto: CreatePurchaseDto) => Promise<void>;
  handleApprove: (purchase_batch_id: string, dto?: ApprovePurchaseDto) => Promise<void>;
  handleMarkPaid: (purchase_batch_id: string, dto?: MarkPaidPurchaseDto) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleExtractOCR: (file: File) => Promise<any>;
  setPrompt: (state: PromptState | null) => void;
}

export function usePurchasesMutations(setPrompt: (state: PromptState | null) => void): UsePurchasesMutationsReturn {
  const { t } = useTranslation("PurchasesPage");

  const [createPurchase] = useCreatePurchaseMutation();
  const [approvePurchase] = useApprovePurchaseMutation();
  const [markPaidPurchase] = useMarkPaidPurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();
  const [extractOCR] = useExtractOCRMutation();

  const [creating, setCreating] = useState(false);
  const [approvingBatchId, setApprovingBatchId] = useState<string | null>(null);
  const [markingPaidBatchId, setMarkingPaidBatchId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [extractingOCR, setExtractingOCR] = useState(false);

  const isApproving = approvingBatchId !== null;
  const isMarkingPaid = markingPaidBatchId !== null;
  const isDeleting = deletingId !== null;

  async function handleCreate(dto: CreatePurchaseDto) {
    if (creating) return;
    try {
      setCreating(true);

      const categoriesWithWarehouseItem: PurchaseCategory[] = ["1330", "2410", "2730"];
      const assetTypeMap: Record<"1330" | "2410" | "2730", "inventory" | "fixed_asset" | "intangible"> = {
        "1330": "inventory",
        "2410": "fixed_asset",
        "2730": "intangible",
      };

      const warehouseItems = dto.items.filter((item) => {
        const itemCategory = item.category;
        const shouldCreateWarehouseItem = categoriesWithWarehouseItem.includes(itemCategory);
        return shouldCreateWarehouseItem && itemCategory in assetTypeMap;
      });

      const totalDelivery: number = dto.delivery_cost ? toNumber(dto.delivery_cost) : 0;
      const itemsCount: number = warehouseItems.length;

      const deliveryPerItem: number = itemsCount > 0 && totalDelivery > 0 ? totalDelivery / itemsCount : 0;

      const roundedDeliveryPerItem: number = Math.round(deliveryPerItem * 100) / 100;

      let createdCount = 0;
      let deliveryAllocated: number = 0;

      for (let i = 0; i < dto.items.length; i++) {
        const item = dto.items[i];
        const itemCategory = item.category;
        const shouldCreateWarehouseItem = categoriesWithWarehouseItem.includes(itemCategory);

        if (shouldCreateWarehouseItem && itemCategory in assetTypeMap) {
          const isLastWarehouseItem: boolean = createdCount === itemsCount - 1;

          let itemDeliveryCost: number;
          if (itemsCount > 0 && totalDelivery > 0) {
            if (isLastWarehouseItem) {
              itemDeliveryCost = totalDelivery - deliveryAllocated;
            } else {
              itemDeliveryCost = roundedDeliveryPerItem;
              deliveryAllocated += roundedDeliveryPerItem;
            }
          } else {
            itemDeliveryCost = 0;
          }

          const receiveDto: ReceiveItemDto = {
            vendor_name: dto.vendor_name,
            vendor_bin: dto.vendor_bin,
            name: item.name,
            description: item.description,
            asset_type: assetTypeMap[itemCategory as "1330" | "2410" | "2730"],
            fixed_asset_group: item.fixed_asset_group as ReceiveItemDto["fixed_asset_group"],
            unit_price: item.unit_price,
            quantity: item.quantity,
            unit: item.unit,
            vat_rate: item.vat_rate,
            delivery_cost: itemDeliveryCost > 0 ? itemDeliveryCost.toFixed(2) : undefined,
            invoice_number: dto.document_number,
            invoice_date: dto.document_date,
            useful_life_months: item.useful_life_months,
            depreciation_rate: item.depreciation_rate,
          };

          await createPurchase(receiveDto).unwrap();
          createdCount++;
        }
      }

      if (createdCount > 0) {
        setPrompt({
          title: t("messages.createSuccessTitle"),
          text: t("messages.createSuccessText"),
          variant: "success",
        });
      } else {
        setPrompt({
          title: t("messages.createJournalOnlyTitle"),
          text: t("messages.createJournalOnlyText"),
          variant: "success",
        });
      }
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.createErrorText", t),
        variant: "error",
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleApprove(purchase_batch_id: string, _dto?: ApprovePurchaseDto) {
    if (isApproving) return;
    try {
      setApprovingBatchId(purchase_batch_id);
      await approvePurchase({ purchase_batch_id }).unwrap();
      setPrompt({
        title: t("messages.approveSuccessTitle"),
        text: t("messages.approveSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.approveErrorText", t),
        variant: "error",
      });
    } finally {
      setApprovingBatchId(null);
    }
  }

  async function handleMarkPaid(purchase_batch_id: string, _dto?: MarkPaidPurchaseDto) {
    if (isMarkingPaid) return;
    try {
      setMarkingPaidBatchId(purchase_batch_id);
      await markPaidPurchase({ purchase_batch_id }).unwrap();
      setPrompt({
        title: t("messages.markPaidSuccessTitle"),
        text: t("messages.markPaidSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.markPaidErrorText", t),
        variant: "error",
      });
    } finally {
      setMarkingPaidBatchId(null);
    }
  }

  async function handleDelete(id: number) {
    if (isDeleting) return;
    try {
      setDeletingId(id);
      await deletePurchase({ id, reason: t("messages.deleteReason") }).unwrap();
      setPrompt({
        title: t("messages.deleteSuccessTitle"),
        text: t("messages.deleteSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.deleteErrorText", t),
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleExtractOCR(file: File) {
    if (extractingOCR) return;
    try {
      setExtractingOCR(true);
      const result = await extractOCR(file).unwrap();
      return result;
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.ocrErrorText", t),
        variant: "error",
      });
      throw err;
    } finally {
      setExtractingOCR(false);
    }
  }

  return {
    creating,
    approvingBatchId,
    markingPaidBatchId,
    deletingId,
    extractingOCR,
    isApproving,
    isMarkingPaid,
    isDeleting,
    handleCreate,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleExtractOCR,
    setPrompt,
  };
}

