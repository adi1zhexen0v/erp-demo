import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CloseCircle } from "iconsax-react";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { Button, DatePicker, ModalForm, Select, Prompt } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { useScrollDetection } from "@/shared/hooks";
import type { WorkerListItem } from "@/features/hr/employees";
import { useCreateResignationLetterMutation } from "../api";
import { createResignationSchema, type CreateResignationFormValues } from "../validation";
import ResignationPreview from "./ResignationPreview";

interface Props {
  employee: WorkerListItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateResignationForm({ employee, onClose, onSuccess }: Props) {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = (i18n.language as Locale) || "ru";
  const { scrollRef, hasScroll } = useScrollDetection();

  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<CreateResignationFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [createResignationLetter, { isLoading: isCreating }] = useCreateResignationLetterMutation();

  const form = useForm<CreateResignationFormValues>({
    resolver: zodResolver(createResignationSchema),
    defaultValues: {
      last_working_day: undefined,
      approval_resolution: null,
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    form.clearErrors();
    reset({
      last_working_day: undefined,
      approval_resolution: null,
    });
  }, [reset, form]);

  const lastWorkingDay = watch("last_working_day");
  const approvalResolution = watch("approval_resolution");

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  useEffect(() => {
    if (lastWorkingDay) {
      form.trigger("last_working_day");
    }
  }, [lastWorkingDay, form]);

  async function onSubmit(data: CreateResignationFormValues) {
    setFormDataForPreview(data);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!formDataForPreview || isCreating) return;

    try {
      const lastWorkingDayStr = formatDateToISO(formDataForPreview.last_working_day);

      await createResignationLetter({
        worker_id: employee.id,
        last_working_day: lastWorkingDayStr,
        approval_resolution: formDataForPreview.approval_resolution || undefined,
      }).unwrap();

      setShowPreview(false);
      setFormDataForPreview(null);
      onSuccess();
    } catch (err) {
      console.error("Error creating resignation application", err);
      setError(t("resignationForm.createError"));
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  if (showPreview && formDataForPreview) {
    return (
      <ResignationPreview
        employee={employee}
        formData={formDataForPreview}
        onClose={handlePreviewClose}
        onSubmit={handlePreviewSubmit}
        isLoading={isCreating}
        locale={locale}
      />
    );
  }

  const approvalResolutionOptions = [
    {
      label: t("resignationForm.approval_resolution.approved_with_1month"),
      value: "approved_with_1month" as const,
    },
    { label: t("resignationForm.approval_resolution.approved"), value: "approved" as const },
    { label: t("resignationForm.approval_resolution.no_objection"), value: "no_objection" as const },
  ];

  return (
    <>
      {error && (
        <Prompt
          title={t("resignationForm.errorTitle")}
          text={error}
          variant="error"
          onClose={() => setError(null)}
          namespace="EmployeesPage"
        />
      )}

      <ModalForm icon={CloseCircle} onClose={onClose}>
        <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 shrink-0 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("resignationForm.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("resignationForm.subtitle")}</p>
          </div>

          <div ref={scrollRef} className={cn("flex-1 overflow-auto flex flex-col gap-5 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
              <DatePicker
                locale={locale}
                mode="single"
                label={t("resignationForm.last_working_day.label")}
                placeholder={t("resignationForm.last_working_day.placeholder")}
                value={lastWorkingDay || null}
                onChange={(v) => {
                  setValue("last_working_day", v as Date, { shouldValidate: true });
                }}
                minDate={today}
                error={errors.last_working_day?.message ? t(errors.last_working_day.message as string) : undefined}
              />

              <Select
                label={t("resignationForm.approval_resolution.label")}
                placeholder={t("resignationForm.approval_resolution.placeholder")}
                options={approvalResolutionOptions}
                value={approvalResolution}
                onChange={(v) => setValue("approval_resolution", v, { shouldValidate: true })}
                error={
                  errors.approval_resolution?.message ? t(errors.approval_resolution.message as string) : undefined
                }
              />
          </div>

          <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
            <Button variant="secondary" className="py-3" onClick={onClose} type="button">
              {t("resignationForm.cancel")}
            </Button>
            <Button variant="primary" type="submit" disabled={isCreating} className="py-3">
              {isCreating ? t("resignationForm.loading") : t("resignationForm.continue")}
            </Button>
          </div>
        </form>
      </ModalForm>
    </>
  );
}
