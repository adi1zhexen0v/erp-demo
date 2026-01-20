import { baseApi } from "@/shared/api";
import type { GetMeResponse, LoginDto, LoginResponse, LogoutResponse, RefreshTokenResponse } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (body) => ({
        url: "/api/hr/auth/manager/login/",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/api/hr/auth/me/",
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/api/hr/auth/refresh/",
        method: "POST",
        credentials: "include",
      }),
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/api/hr/auth/logout/",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Ignore errors, logout should proceed anyway
        } finally {
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useLogoutMutation, useGetMeQuery } = authApi;
