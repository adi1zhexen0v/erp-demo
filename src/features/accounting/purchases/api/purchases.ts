import { baseApi } from "@/shared/api";
import type { ApprovePurchaseDto, MarkPaidPurchaseDto } from "../types";
import type { OCRResponse, ReceiveItemDto, InventoryItemResponse, InventoryItemListItem } from "../../warehouse/types";

export const purchasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchasesItems: builder.query<InventoryItemListItem[], void>({
      query: () => ({
        url: `/api/warehouse/items/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "InventoryItems" as const, id: "LIST" }],
    }),
    createPurchase: builder.mutation<InventoryItemResponse, ReceiveItemDto>({
      query: (body) => ({
        url: `/api/warehouse/items/receive/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [
        { type: "InventoryItems" as const, id: "LIST" },
        { type: "InventoryItems" as const, id: "VENDORS_LIST" },
      ],
    }),
    extractOCR: builder.mutation<OCRResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/api/warehouse/ocr/extract/`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
    }),
    approvePurchase: builder.mutation<InventoryItemListItem[], ApprovePurchaseDto>({
      query: (body) => ({
        url: `/api/warehouse/items/approve-batch/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "InventoryItems" as const, id: "LIST" }],
    }),
    markPaidPurchase: builder.mutation<InventoryItemListItem[], MarkPaidPurchaseDto>({
      query: (body) => ({
        url: `/api/warehouse/items/mark-batch-paid/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "InventoryItems" as const, id: "LIST" }],
    }),
    deletePurchase: builder.mutation<void, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/api/warehouse/items/${id}/write_off/`,
        method: "POST",
        body: { reason },
        credentials: "include",
      }),
      invalidatesTags: [{ type: "InventoryItems" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetPurchasesItemsQuery,
  useCreatePurchaseMutation,
  useExtractOCRMutation,
  useApprovePurchaseMutation,
  useMarkPaidPurchaseMutation,
  useDeletePurchaseMutation,
} = purchasesApi;

