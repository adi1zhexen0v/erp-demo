import { baseApi } from "@/shared/api";
import type {
  Form20000Response,
  Form20001Response,
  Form20005Response,
  AvailableQuartersResponse,
  QuarterSummaryResponse,
} from "../types/api";

interface Form200Params {
  year: number;
  quarter: number;
  include_gph?: boolean;
}

interface AvailableQuartersParams {
  year: number;
}

interface QuarterSummaryParams {
  year: number;
  quarter: number;
}

export const payrollTaxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollTaxForm200: builder.query<Form20000Response, Form200Params>({
      query: (params) => ({
        url: `/api/accounting/payroll-tax/form-200/`,
        method: "GET",
        params: {
          year: params.year,
          quarter: params.quarter,
          ...(params.include_gph && { include_gph: params.include_gph }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "PAYROLL_200" }],
    }),

    getPayrollTaxForm20001: builder.query<Form20001Response, Form200Params>({
      query: (params) => ({
        url: `/api/accounting/payroll-tax/form-200-01/`,
        method: "GET",
        params: {
          year: params.year,
          quarter: params.quarter,
          ...(params.include_gph && { include_gph: params.include_gph }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "PAYROLL_200_01" }],
    }),

    getPayrollTaxForm20005: builder.query<Form20005Response, Form200Params>({
      query: (params) => ({
        url: `/api/accounting/payroll-tax/form-200-05/`,
        method: "GET",
        params: {
          year: params.year,
          quarter: params.quarter,
          ...(params.include_gph && { include_gph: params.include_gph }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "PAYROLL_200_05" }],
    }),

    getPayrollTaxQuarters: builder.query<AvailableQuartersResponse, AvailableQuartersParams>({
      query: (params) => ({
        url: `/api/accounting/payroll-tax/quarters/`,
        method: "GET",
        params: {
          year: params.year,
        },
        credentials: "include",
      }),
    }),

    getPayrollTaxSummary: builder.query<QuarterSummaryResponse, QuarterSummaryParams>({
      query: (params) => ({
        url: `/api/accounting/payroll-tax/summary/`,
        method: "GET",
        params: {
          year: params.year,
          quarter: params.quarter,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetPayrollTaxForm200Query,
  useGetPayrollTaxForm20001Query,
  useGetPayrollTaxForm20005Query,
  useGetPayrollTaxQuartersQuery,
  useGetPayrollTaxSummaryQuery,
} = payrollTaxApi;

