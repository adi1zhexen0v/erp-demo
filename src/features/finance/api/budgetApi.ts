import { baseApi } from "@/shared/api";
import type { BudgetSummary } from "../types/api";

interface BudgetParams {
  start_date: string;
  end_date: string;
}

export const budgetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBudgetSummary: builder.query<BudgetSummary, BudgetParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("start_date", params.start_date);
        searchParams.set("end_date", params.end_date);
        return {
          url: `/api/accounting/budget/?${searchParams.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: [{ type: "Budget" as const, id: "SUMMARY" }],
    }),
  }),
});

export const { useGetBudgetSummaryQuery } = budgetApi;

