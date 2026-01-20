import { baseApi } from "@/shared/api";
import type {
  RentalPayment,
  RentalPaymentListItem,
  RentalPaymentCreateRequest,
  RentalPaymentUpdateRequest,
  RentalPaymentApproveRequest,
  RentalPaymentApproveResponse,
  RentalPaymentMarkPaidResponse,
  RentalPaymentsListQueryParams,
  RentalPaymentOCRResponse,
} from "../types";

export const rentalPaymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRentalPayments: builder.query<RentalPaymentListItem[], RentalPaymentsListQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          if (params.rental_type) searchParams.append("rental_type", params.rental_type);
          if (params.status) searchParams.append("status", params.status);
          if (params.start_date) searchParams.append("start_date", params.start_date);
          if (params.end_date) searchParams.append("end_date", params.end_date);
          if (params.vehicle_rental_id)
            searchParams.append("vehicle_rental_id", String(params.vehicle_rental_id));
          if (params.premises_lease_id)
            searchParams.append("premises_lease_id", String(params.premises_lease_id));
        }
        const queryString = searchParams.toString();
          return {
            url: `/api/legal/rental-payments/${queryString ? `?${queryString}` : ""}`,
            method: "GET",
          };
        },
        providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "RentalPayments" as const, id })),
              { type: "RentalPayments" as const, id: "LIST" },
            ]
          : [{ type: "RentalPayments" as const, id: "LIST" }],
    }),

    getRentalPayment: builder.query<RentalPayment, number>({
      query: (id) => ({
        url: `/api/legal/rental-payments/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "RentalPayments" as const, id }],
    }),

    createRentalPayment: builder.mutation<RentalPayment, RentalPaymentCreateRequest>({
      query: (body) => ({
        url: "/api/legal/rental-payments/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "RentalPayments" as const, id: "LIST" }],
    }),

    updateRentalPayment: builder.mutation<RentalPayment, { id: number; data: RentalPaymentUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/api/legal/rental-payments/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RentalPayments" as const, id },
        { type: "RentalPayments" as const, id: "LIST" },
      ],
    }),

    deleteRentalPayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/legal/rental-payments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "RentalPayments" as const, id },
        { type: "RentalPayments" as const, id: "LIST" },
      ],
    }),

    approveRentalPayment: builder.mutation<RentalPaymentApproveResponse, { id: number; data?: RentalPaymentApproveRequest }>({
      query: ({ id, data }) => ({
        url: `/api/legal/rental-payments/${id}/approve/`,
        method: "POST",
        body: data || {},
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "RentalPayments" as const, id },
        { type: "RentalPayments" as const, id: "LIST" },
      ],
    }),

    markRentalPaymentPaid: builder.mutation<RentalPaymentMarkPaidResponse, number>({
      query: (id) => ({
        url: `/api/legal/rental-payments/${id}/mark-paid/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "RentalPayments" as const, id },
        { type: "RentalPayments" as const, id: "LIST" },
      ],
    }),

    extractOCR: builder.mutation<RentalPaymentOCRResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/api/legal/rental-payments/ocr/`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useGetRentalPaymentsQuery,
  useGetRentalPaymentQuery,
  useCreateRentalPaymentMutation,
  useUpdateRentalPaymentMutation,
  useDeleteRentalPaymentMutation,
  useApproveRentalPaymentMutation,
  useMarkRentalPaymentPaidMutation,
  useExtractOCRMutation,
} = rentalPaymentsApi;

