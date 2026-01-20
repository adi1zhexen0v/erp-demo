import { baseApi } from "./index";

export interface HolidayApiResponse {
  id: number;
  month: number;
  day: number;
  name_ru: string;
  name_kk: string;
}

export const holidaysApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHolidays: builder.query<HolidayApiResponse[], void>({
      query: () => ({
        url: "/api/accounting/holidays/",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Holidays"],
    }),
  }),
});

export const { useGetHolidaysQuery } = holidaysApi;








