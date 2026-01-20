import { baseApi } from "@/shared/api";
import type {
  Form100Data,
  Form10001Data,
  Form10002Data,
  Form10007Data,
} from "../types/api";

interface Form100Params {
  year: number;
  end_date?: string;
}

interface Form10007Params {
  year: number;
  as_of_date?: string;
}

export const citApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCitForm100: builder.query<Form100Data, Form100Params>({
      query: (params) => ({
        url: `/api/accounting/cit/form-100/`,
        method: "GET",
        params: {
          year: params.year,
          ...(params.end_date && { end_date: params.end_date }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "CIT_100" }],
    }),

    getCitForm10001: builder.query<Form10001Data, Form100Params>({
      query: (params) => ({
        url: `/api/accounting/cit/form-100-01/`,
        method: "GET",
        params: {
          year: params.year,
          ...(params.end_date && { end_date: params.end_date }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "CIT_100_01" }],
    }),

    getCitForm10002: builder.query<Form10002Data, Form100Params>({
      query: (params) => ({
        url: `/api/accounting/cit/form-100-02/`,
        method: "GET",
        params: {
          year: params.year,
          ...(params.end_date && { end_date: params.end_date }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "CIT_100_02" }],
    }),

    getCitForm10007: builder.query<Form10007Data, Form10007Params>({
      query: (params) => ({
        url: `/api/accounting/cit/form-100-07/`,
        method: "GET",
        params: {
          year: params.year,
          ...(params.as_of_date && { as_of_date: params.as_of_date }),
        },
        credentials: "include",
      }),
      providesTags: [{ type: "Reports" as const, id: "CIT_100_07" }],
    }),
  }),
});

export const {
  useGetCitForm100Query,
  useGetCitForm10001Query,
  useGetCitForm10002Query,
  useGetCitForm10007Query,
} = citApi;

