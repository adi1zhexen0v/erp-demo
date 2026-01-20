import {
  type BaseQueryFn,
  createApi,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "@/features/auth/slice";
import { LOGIN_PAGE_ROUTE } from "@/shared/utils";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "true");
    return headers;
  },
});

let refreshPromise: Promise<{ data?: unknown; error?: FetchBaseQueryError }> | null = null;

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Извлечение URL из args
    const requestUrl = typeof args === "string" ? args : args.url;

    // Если это сам refresh endpoint вернул 401 - сразу logout и редирект
    if (requestUrl && (requestUrl.includes("/api/hr/auth/refresh/") || requestUrl.endsWith("/auth/refresh/"))) {
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      window.location.href = LOGIN_PAGE_ROUTE;
      return result;
    }
    if (!refreshPromise) {
      refreshPromise = (async () => {
        return await rawBaseQuery(
          {
            url: "/api/hr/auth/refresh/",
            method: "POST",
          },
          api,
          extraOptions,
        );
      })();
    }

    const refreshResult = await refreshPromise;
    refreshPromise = null;

    // Если refresh вернул 401 - сразу logout и редирект (защита от бесконечных запросов)
    if (refreshResult?.error?.status === 401) {
      if (import.meta.env.DEV) {
        console.warn(
          "Session refresh failed with 401 - user will be logged out. Possible Safari ITP / third-party cookie issue.",
        );
      }
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      window.location.href = LOGIN_PAGE_ROUTE;
      return result;
    }

    if (refreshResult && "data" in refreshResult && refreshResult.data) {
      await new Promise((resolve) => setTimeout(resolve, 75));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      if (import.meta.env.DEV) {
        console.warn(
          "Session refresh failed - user will be logged out. Possible Safari ITP / third-party cookie issue.",
        );
      }
      api.dispatch(logout());
      api.dispatch(baseApi.util.resetApiState());
      window.location.href = LOGIN_PAGE_ROUTE;
      return result;
    }
  }

  if (result.error && result.error.status === 403) {
    console.warn("Access forbidden (403):", result.error);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Applications",
    "Completeness",
    "Contracts",
    "NGOWorkers",
    "VehicleRentals",
    "PremisesLeases",
    "LegalDocuments",
    "ServiceAgreementsIndividual",
    "VehicleHandovers",
    "PremisesHandovers",
    "ServiceAgreementsMSB",
    "GoodsSupply",
    "CompletionActs",
    "AvailableServices",
    "LeaveApplications",
    "ResignationLetters",
    "Amendments",
    "Timesheets",
    "Payrolls",
    "InventoryItems",
    "InventoryUnits",
    "Holidays",
    "Reports",
    "Budget",
    "RentalPayments",
  ],
  endpoints: () => ({}),
});

