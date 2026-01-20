import { baseApi } from "@/shared/api";
import type {
  PLReportResponse,
  BalanceSheetResponse,
  CashFlowResponse,
  TrialBalanceResponse,
  JournalEntriesResponse,
  DepreciationReport,
} from "../types/reports";

interface PLReportParams {
  start_date: string;
  end_date: string;
}

interface BalanceSheetParams {
  as_of_date: string;
  period_start_date?: string;
}

interface CashFlowParams {
  start_date: string;
  end_date: string;
}

interface TrialBalanceParams {
  start_date: string;
  end_date: string;
}

interface JournalEntriesParams {
  start_date: string;
  end_date: string;
}

interface DepreciationReportParams {
  report_date: string;
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPLReport: builder.query<PLReportResponse, PLReportParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("start_date", params.start_date);
        searchParams.set("end_date", params.end_date);
        return {
          url: `/api/accounting/pl-report/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Reports" as const, id: "PL_REPORT" }],
    }),

    getBalanceSheet: builder.query<BalanceSheetResponse, BalanceSheetParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("as_of_date", params.as_of_date);
        if (params.period_start_date) {
          searchParams.set("period_start_date", params.period_start_date);
        }
        return {
          url: `/api/accounting/balance-sheet/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Reports" as const, id: "BALANCE_SHEET" }],
    }),

    getCashFlow: builder.query<CashFlowResponse, CashFlowParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("start_date", params.start_date);
        searchParams.set("end_date", params.end_date);
        return {
          url: `/api/accounting/cash-flow/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Reports" as const, id: "CASH_FLOW" }],
    }),

    getTrialBalance: builder.query<TrialBalanceResponse, TrialBalanceParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("start_date", params.start_date);
        searchParams.set("end_date", params.end_date);
        return {
          url: `/api/accounting/trial-balance/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Reports" as const, id: "TRIAL_BALANCE" }],
    }),

    getJournalEntries: builder.query<JournalEntriesResponse, JournalEntriesParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("entry_date__gte", params.start_date);
        searchParams.set("entry_date__lte", params.end_date);
        return {
          url: `/api/accounting/journal-entries/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Reports" as const, id: "JOURNAL_ENTRIES" }],
    }),

    getDepreciationReport: builder.query<DepreciationReport, DepreciationReportParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("report_date", params.report_date);
        return {
          url: `/api/warehouse/depreciation-report/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Reports" as const, id: "DEPRECIATION_REPORT" }],
    }),

    downloadBalanceSheet: builder.mutation<Blob, string | undefined>({
      query: (asOfDate) => {
        const searchParams = new URLSearchParams();
        if (asOfDate) {
          searchParams.set("as_of_date", asOfDate);
        }
        return {
          url: `/api/accounting/export/balance-sheet/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    downloadPLReport: builder.mutation<Blob, { start_date: string; end_date: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("start_date", params.start_date);
        searchParams.set("end_date", params.end_date);
        return {
          url: `/api/accounting/export/pl-report/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

export const {
  useGetPLReportQuery,
  useGetBalanceSheetQuery,
  useGetCashFlowQuery,
  useGetTrialBalanceQuery,
  useGetJournalEntriesQuery,
  useGetDepreciationReportQuery,
  useDownloadBalanceSheetMutation,
  useDownloadPLReportMutation,
} = reportsApi;

