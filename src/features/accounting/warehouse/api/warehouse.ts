import { baseApi } from "@/shared/api";
import type {
  VendorResponse,
  CreateVendorDto,
  UpdateVendorDto,
  InventoryItemResponse,
  InventoryItemListItem,
  InventoryUnit,
  AssetAssignmentResponse,
  InventoryMovementResponse,
  AssignItemDto,
  ReturnItemDto,
  WriteOffItemDto,
  ReturnUnitResponse,
  WriteOffUnitResponse,
  DepreciationForecast,
  PublicUnitInfo,
} from "../types";
import type { MovementType, ItemStatus } from "../types/domain";

export const warehouseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<VendorResponse[], void>({
      query: () => ({
        url: `/api/warehouse/vendors/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "InventoryItems" as const, id: "VENDORS_LIST" }],
    }),

    getVendor: builder.query<VendorResponse, number>({
      query: (id) => ({
        url: `/api/warehouse/vendors/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "InventoryItems" as const, id: `VENDOR_${id}` }],
    }),

    createVendor: builder.mutation<VendorResponse, CreateVendorDto>({
      query: (body) => ({
        url: `/api/warehouse/vendors/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "InventoryItems" as const, id: "VENDORS_LIST" }],
    }),

    updateVendor: builder.mutation<VendorResponse, { id: number; body: UpdateVendorDto }>({
      query: ({ id, body }) => ({
        url: `/api/warehouse/vendors/${id}/`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "InventoryItems" as const, id: `VENDOR_${id}` },
        { type: "InventoryItems" as const, id: "VENDORS_LIST" },
      ],
    }),

    deleteVendor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/warehouse/vendors/${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "InventoryItems" as const, id: `VENDOR_${id}` },
        { type: "InventoryItems" as const, id: "VENDORS_LIST" },
      ],
    }),

    getWarehouseUnits: builder.query<
      InventoryUnit[],
      {
        status?: ItemStatus;
        inventory_item?: number;
        assigned_to?: number;
        search?: string;
        ordering?: string;
      } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.inventory_item) searchParams.append("inventory_item", String(params.inventory_item));
        if (params?.assigned_to) searchParams.append("assigned_to", String(params.assigned_to));
        if (params?.search) searchParams.append("search", params.search);
        if (params?.ordering) searchParams.append("ordering", params.ordering);
        const queryString = searchParams.toString();
        return {
          url: queryString ? `/api/warehouse/units/?${queryString}` : `/api/warehouse/units/`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "InventoryUnits" as const, id: "LIST" }],
    }),

    getWarehouseUnitDetail: builder.query<InventoryUnit, number>({
      query: (id) => ({
        url: `/api/warehouse/units/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "InventoryUnits" as const, id }],
    }),

    getUnitForecast: builder.query<DepreciationForecast, { id: number; months?: number }>({
      query: ({ id, months = 12 }) => ({
        url: `/api/warehouse/units/${id}/forecast/`,
        method: "GET",
        params: {
          months,
        },
        credentials: "include",
      }),
      providesTags: (_result, _error, { id }) => [{ type: "InventoryUnits" as const, id }],
    }),

    assignUnit: builder.mutation<AssetAssignmentResponse, { id: number; body: AssignItemDto }>({
      query: ({ id, body }) => ({
        url: `/api/warehouse/units/${id}/assign/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "InventoryUnits" as const, id },
        { type: "InventoryUnits" as const, id: "LIST" },
        { type: "InventoryItems" as const, id: "ASSIGNMENTS_LIST" },
      ],
    }),

    returnUnit: builder.mutation<ReturnUnitResponse, { id: number; body?: ReturnItemDto }>({
      query: ({ id, body = {} }) => ({
        url: `/api/warehouse/units/${id}/return/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "InventoryUnits" as const, id },
        { type: "InventoryUnits" as const, id: "LIST" },
        { type: "InventoryItems" as const, id: "ASSIGNMENTS_LIST" },
      ],
    }),

    writeOffUnit: builder.mutation<WriteOffUnitResponse, { id: number; body: WriteOffItemDto }>({
      query: ({ id, body }) => ({
        url: `/api/warehouse/units/${id}/write-off/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "InventoryUnits" as const, id },
        { type: "InventoryUnits" as const, id: "LIST" },
        { type: "InventoryItems" as const, id: "MOVEMENTS_LIST" },
      ],
    }),

    getWarehouseItems: builder.query<InventoryItemListItem[], void>({
      query: () => ({
        url: `/api/warehouse/items/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "InventoryItems" as const, id: "LIST" }],
    }),

    getWarehouseItemDetail: builder.query<InventoryItemResponse, number>({
      query: (id) => ({
        url: `/api/warehouse/items/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "InventoryItems" as const, id }],
    }),

    getAssignments: builder.query<AssetAssignmentResponse[], void>({
      query: () => ({
        url: `/api/warehouse/assignments/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [{ type: "InventoryItems" as const, id: "ASSIGNMENTS_LIST" }],
    }),

    getAssignment: builder.query<AssetAssignmentResponse, number>({
      query: (id) => ({
        url: `/api/warehouse/assignments/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "InventoryItems" as const, id: `ASSIGNMENT_${id}` }],
    }),

    returnAssignment: builder.mutation<InventoryItemResponse, { id: number; body?: { notes?: string } }>({
      query: ({ id, body = {} }) => ({
        url: `/api/warehouse/assignments/${id}/return/`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "InventoryItems" as const, id: `ASSIGNMENT_${id}` },
        { type: "InventoryItems" as const, id: "ASSIGNMENTS_LIST" },
        { type: "InventoryItems" as const, id: "LIST" },
      ],
    }),

    getMovements: builder.query<InventoryMovementResponse[], { item?: number; type?: MovementType } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.item) searchParams.append("item", String(params.item));
        if (params?.type) searchParams.append("type", params.type);
        const queryString = searchParams.toString();
        return {
          url: queryString ? `/api/warehouse/movements/?${queryString}` : `/api/warehouse/movements/`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "InventoryItems" as const, id: "MOVEMENTS_LIST" }],
    }),

    getMovement: builder.query<InventoryMovementResponse, number>({
      query: (id) => ({
        url: `/api/warehouse/movements/${id}/`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (_result, _error, id) => [{ type: "InventoryItems" as const, id: `MOVEMENT_${id}` }],
    }),

    getPublicUnitInfo: builder.query<PublicUnitInfo, string>({
      query: (barcode) => ({
        url: `/api/warehouse/public/units/${barcode}/`,
        method: "GET",
        credentials: "omit",
      }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useLazyGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useGetWarehouseUnitsQuery,
  useGetWarehouseUnitDetailQuery,
  useLazyGetWarehouseUnitDetailQuery,
  useGetUnitForecastQuery,
  useAssignUnitMutation,
  useReturnUnitMutation,
  useWriteOffUnitMutation,
  useGetWarehouseItemsQuery,
  useGetWarehouseItemDetailQuery,
  useLazyGetWarehouseItemDetailQuery,
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useLazyGetAssignmentQuery,
  useReturnAssignmentMutation,
  useGetMovementsQuery,
  useGetMovementQuery,
  useLazyGetMovementQuery,
  useGetPublicUnitInfoQuery,
} = warehouseApi;

