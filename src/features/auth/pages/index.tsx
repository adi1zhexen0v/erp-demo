import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "@/shared/hooks";
import { Button, Input } from "@/shared/ui";
import { HR_EMPLOYEES_PAGE_ROUTE } from "@/shared/utils";
import { useLoginMutation } from "../api";
import { setAuth } from "../slice";
import type { LoginErrorResponse } from "../types";
import { mapBackendErrorToI18nKey } from "../utils/errorMapping";
import { type LoginFormValues, loginSchema } from "../validation";

function getLoginErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const fetchError = error as FetchBaseQueryError;

    if (fetchError.data && typeof fetchError.data === "object") {
      const errorData = fetchError.data as LoginErrorResponse;

      if (errorData.error && typeof errorData.error === "string") {
        return mapBackendErrorToI18nKey(errorData.error);
      }
    }

    if (fetchError.status === "FETCH_ERROR" || fetchError.status === "PARSING_ERROR") {
      return "errors.server_unavailable";
    }

    if (typeof fetchError.status === "number" && fetchError.status >= 500) {
      return "errors.server_unavailable";
    }
  }

  return "errors.unknown";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("LoginPage");

  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const res = await login(data).unwrap();
      dispatch(setAuth(res.user));
      navigate(HR_EMPLOYEES_PAGE_ROUTE);
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <div className="max-w-7xl mx-auto my-16">
        <h1 className="text-center text-display-xs content-base-primary">{t("title")}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-12 flex flex-col gap-4">
          <Input
            label={t("email.label")}
            placeholder={t("email.placeholder")}
            {...register("email")}
            error={errors.email?.message ? t(errors.email.message) : undefined}
          />

          <Input
            type="password"
            label={t("password.label")}
            placeholder={t("password.placeholder")}
            {...register("password")}
            error={errors.password?.message ? t(errors.password.message) : undefined}
          />

          {error && !isLoading && <p className="content-action-negative">{t(getLoginErrorMessage(error))}</p>}
          <Button variant="primary" disabled={isLoading} type="submit">
            {isLoading ? t("loading") : t("button")}
          </Button>
        </form>
      </div>
    </>
  );
}
