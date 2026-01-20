import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { SunFog, PauseCircle } from "iconsax-react";
import cn from "classnames";
import { Button, ButtonGroup, DatePicker, Input, ModalForm, Select, Toast } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { useScrollDetection } from "@/shared/hooks";
import type { WorkerListItem } from "@/features/hr/employees";
import { useCreateAnnualLeaveMutation, useCreateUnpaidLeaveMutation } from "../api";
import { createLeaveSchema, type CreateLeaveFormValues } from "../validation";
import { findOverlappingLeaves, formatLeavePeriod, getActiveLeavesForWorker } from "../utils";
import type { AnnualLeaveResponse, UnpaidLeaveResponse, MedicalLeaveResponse } from "../types";
import AnnualLeavePreview from "./AnnualLeavePreview";
import UnpaidLeavePreview from "./UnpaidLeavePreview";

interface Props {
  employee: WorkerListItem;
  annualLeaves: AnnualLeaveResponse[];
  unpaidLeaves: UnpaidLeaveResponse[];
  medicalLeaves?: MedicalLeaveResponse[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLeaveForm({
  employee,
  annualLeaves,
  unpaidLeaves,
  medicalLeaves,
  onClose,
  onSuccess,
}: Props) {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = (i18n.language as Locale) || "ru";
  const { scrollRef, hasScroll } = useScrollDetection();

  const [leaveType, setLeaveType] = useState<"annual" | "unpaid">("annual");
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<CreateLeaveFormValues | null>(null);

  const [createAnnualLeave, { isLoading: isCreatingAnnual }] = useCreateAnnualLeaveMutation();
  const [createUnpaidLeave, { isLoading: isCreatingUnpaid }] = useCreateUnpaidLeaveMutation();

  const schema = useMemo(
    function () {
      return createLeaveSchema(
        leaveType,
        employee.vacation_days_available,
        employee.id,
        annualLeaves,
        unpaidLeaves,
        undefined,
      );
    },
    [leaveType, employee.vacation_days_available, employee.id, annualLeaves, unpaidLeaves],
  );

  const form = useForm<CreateLeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
      reason: "",
      approval_resolution: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  useEffect(
    function () {
      form.clearErrors();
      reset({
        start_date: undefined,
        end_date: undefined,
        reason: "",
        approval_resolution: null,
      });
    },
    [leaveType, reset, form],
  );

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const approvalResolution = watch("approval_resolution");

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  useEffect(
    function () {
      if (startDate) {
        form.trigger("start_date");
      }
    },
    [startDate, form],
  );

  useEffect(
    function () {
      if (endDate) {
        form.trigger("end_date");
      }
    },
    [endDate, form],
  );

  const isLoading = isCreatingAnnual || isCreatingUnpaid;

  const activeLeaves = useMemo(() => {
    return getActiveLeavesForWorker(employee.id, annualLeaves, unpaidLeaves, medicalLeaves);
  }, [employee.id, annualLeaves, unpaidLeaves, medicalLeaves]);

  const hasActiveLeaves = activeLeaves.length > 0;

  const activeLeaveToastText = useMemo(() => {
    if (!hasActiveLeaves) return null;

    const firstActiveLeave = activeLeaves[0];
    const period = formatLeavePeriod(firstActiveLeave.leave.start_date, firstActiveLeave.leave.end_date);
    const leaveTypeKey = firstActiveLeave.leaveType;

    return t(`leaveForm.overlap.goes.${leaveTypeKey}`, { period });
  }, [hasActiveLeaves, activeLeaves, t]);

  const overlappingLeaves = useMemo(() => {
    if (!startDate || !endDate) {
      return [];
    }
    return findOverlappingLeaves(employee.id, startDate, endDate, annualLeaves, unpaidLeaves, medicalLeaves);
  }, [employee.id, startDate, endDate, annualLeaves, unpaidLeaves, medicalLeaves]);

  const hasOverlaps = overlappingLeaves.length > 0;

  const overlapErrorText = useMemo(() => {
    if (!hasOverlaps) return null;

    const firstOverlap = overlappingLeaves[0];
    const period = formatLeavePeriod(firstOverlap.leave.start_date, firstOverlap.leave.end_date);
    const leaveTypeKey = firstOverlap.leaveType;

    return t(`leaveForm.overlap.error.conflicts.${leaveTypeKey}`, { period });
  }, [hasOverlaps, overlappingLeaves, t]);

  function onSubmit(data: CreateLeaveFormValues) {
    if (hasOverlaps) {
      return;
    }
    setFormDataForPreview(data);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!formDataForPreview || isLoading) return;

    try {
      const startDateStr = formatDateToISO(formDataForPreview.start_date);
      const endDateStr = formatDateToISO(formDataForPreview.end_date);

      if (leaveType === "annual") {
        await createAnnualLeave({
          worker_id: employee.id,
          start_date: startDateStr,
          end_date: endDateStr,
          reason: formDataForPreview.reason || undefined,
        }).unwrap();
      } else {
        await createUnpaidLeave({
          worker_id: employee.id,
          start_date: startDateStr,
          end_date: endDateStr,
          reason: formDataForPreview.reason || "",
          approval_resolution: formDataForPreview.approval_resolution || undefined,
        }).unwrap();
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Ошибка при создании заявления на отпуск", err);
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  function handleLeaveTypeChange(value: string) {
    setLeaveType(value as "annual" | "unpaid");
  }

  function handleStartDateChange(v: Date | null) {
    if (v) {
      setValue("start_date", v, { shouldValidate: true });
    } else {
      setValue("start_date", undefined as any, { shouldValidate: true });
    }
  }

  function handleEndDateChange(v: Date | null) {
    if (v) {
      setValue("end_date", v, { shouldValidate: true });
    } else {
      setValue("end_date", undefined as any, { shouldValidate: true });
    }
  }

  function handleApprovalResolutionChange(v: "approved" | "recommend" | "no_objection" | null) {
    setValue("approval_resolution", v, { shouldValidate: true });
  }

  if (showPreview && formDataForPreview) {
    if (leaveType === "annual") {
      return (
        <AnnualLeavePreview
          employee={employee}
          formData={formDataForPreview}
          onClose={handlePreviewClose}
          onSubmit={handlePreviewSubmit}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <UnpaidLeavePreview
          employee={employee}
          formData={formDataForPreview}
          onClose={handlePreviewClose}
          onSubmit={handlePreviewSubmit}
          isLoading={isLoading}
        />
      );
    }
  }

  const approvalResolutionOptions = [
    { label: t("leaveForm.approval_resolution.approved"), value: "approved" as const },
    { label: t("leaveForm.approval_resolution.recommend"), value: "recommend" as const },
    { label: t("leaveForm.approval_resolution.no_objection"), value: "no_objection" as const },
  ];

  return (
    <ModalForm icon={SunFog} onClose={onClose}>
      <form key={leaveType} className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 shrink-0 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("leaveForm.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("leaveForm.subtitle")}</p>
        </div>

        <div
          ref={scrollRef}
          className={cn("flex-1 overflow-auto flex flex-col gap-5 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
          <ButtonGroup
            fullWidth
            options={[
              {
                label: (
                  <>
                    <SunFog size={16} variant="Bold" color="currentColor" />
                    {t("leaveForm.annual")}
                  </>
                ),
                value: "annual",
              },
              {
                label: (
                  <>
                    <PauseCircle size={16} variant="Bold" color="currentColor" />
                    {t("leaveForm.unpaid")}
                  </>
                ),
                value: "unpaid",
              },
            ]}
            value={leaveType}
            onChange={handleLeaveTypeChange}
          />

          {hasActiveLeaves && activeLeaveToastText && (
            <Toast color="notice" text={activeLeaveToastText} closable={false} autoClose={false} />
          )}

          {!hasActiveLeaves && leaveType === "annual" && employee.vacation_days_available !== undefined && (
            <Toast
              color="grey"
              text={t("leaveForm.vacationDaysAvailable", {
                count: Math.floor(employee.vacation_days_available),
              })}
              closable={false}
              autoClose={false}
            />
          )}

          <DatePicker
            locale={locale}
            mode="single"
            label={t("leaveForm.start_date.label")}
            placeholder={t("leaveForm.start_date.placeholder")}
            value={startDate || null}
            onChange={handleStartDateChange}
            minDate={today}
            error={errors.start_date?.message ? t(errors.start_date.message as string) : undefined}
          />

          <DatePicker
            locale={locale}
            mode="single"
            label={t("leaveForm.end_date.label")}
            placeholder={t("leaveForm.end_date.placeholder")}
            value={endDate || null}
            onChange={handleEndDateChange}
            minDate={today}
            error={
              errors.end_date?.message
                ? t(errors.end_date.message as string)
                : hasOverlaps && overlapErrorText
                  ? `${t("leaveForm.overlap.error.message")}. ${overlapErrorText}`
                  : undefined
            }
          />

          {leaveType === "unpaid" && (
            <>
              <Input
                label={t("leaveForm.reason.label")}
                placeholder={t("leaveForm.reason.placeholder")}
                isTextarea
                {...register("reason")}
                error={errors.reason?.message ? t(errors.reason.message as string) : undefined}
              />

              <Select
                label={t("leaveForm.approval_resolution.label")}
                placeholder={t("leaveForm.approval_resolution.placeholder")}
                options={approvalResolutionOptions}
                value={approvalResolution}
                onChange={handleApprovalResolutionChange}
                error={
                  errors.approval_resolution?.message ? t(errors.approval_resolution.message as string) : undefined
                }
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
          <Button variant="secondary" className="py-3" onClick={onClose} type="button">
            {t("leaveForm.cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading || hasOverlaps} className="py-3">
            {isLoading ? t("leaveForm.loading") : t("leaveForm.continue")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}

