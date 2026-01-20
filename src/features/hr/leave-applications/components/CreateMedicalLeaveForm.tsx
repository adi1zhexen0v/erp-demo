import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddCircle } from "iconsax-react";
import cn from "classnames";
import { Button, DatePicker, Input, ModalForm, Toast } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { useScrollDetection } from "@/shared/hooks";
import type { WorkerListItem } from "@/features/hr/employees";
import { useCreateMedicalLeaveMutation } from "../api";
import { createLeaveSchema, type CreateLeaveFormValues } from "../validation";
import { findOverlappingLeaves, formatLeavePeriod, getActiveLeavesForWorker } from "../utils";
import type { AnnualLeaveResponse, UnpaidLeaveResponse, MedicalLeaveResponse } from "../types";
import MedicalLeavePreview from "./MedicalLeavePreview";

interface Props {
  employee: WorkerListItem;
  annualLeaves?: AnnualLeaveResponse[];
  unpaidLeaves?: UnpaidLeaveResponse[];
  medicalLeaves: MedicalLeaveResponse[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateMedicalLeaveForm({ employee, annualLeaves, unpaidLeaves, medicalLeaves, onClose, onSuccess }: Props) {
  const { i18n, t } = useTranslation("EmployeesPage");
  const locale = (i18n.language as Locale) || "ru";
  const { scrollRef, hasScroll } = useScrollDetection();

  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<CreateLeaveFormValues | null>(null);

  const [createMedicalLeave, { isLoading: isCreatingMedical }] = useCreateMedicalLeaveMutation();

  const schema = useMemo(
    function () {
      return createLeaveSchema("medical", undefined, employee.id, undefined, undefined, medicalLeaves);
    },
    [employee.id, medicalLeaves],
  );

  const form = useForm<CreateLeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
      reason: "",
      approval_resolution: null,
      diagnosis: "",
      certificate_required: true,
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
        diagnosis: "",
        certificate_required: true,
      });
    },
    [reset, form],
  );

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const diagnosis = watch("diagnosis");

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
    if (!formDataForPreview || isCreatingMedical) return;

    try {
      const startDateStr = formatDateToISO(formDataForPreview.start_date);
      const endDateStr = formatDateToISO(formDataForPreview.end_date);

      await createMedicalLeave({
        worker_id: employee.id,
        start_date: startDateStr,
        end_date: endDateStr,
        diagnosis: formDataForPreview.diagnosis || undefined,
        certificate_required: formDataForPreview.certificate_required ?? true,
      }).unwrap();

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Ошибка при создании заявления на больничный", err);
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
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

  function handleDiagnosisChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("diagnosis", e.target.value);
  }

  if (showPreview && formDataForPreview) {
    return (
      <MedicalLeavePreview
        employee={employee}
        formData={formDataForPreview}
        onClose={handlePreviewClose}
        onSubmit={handlePreviewSubmit}
        isLoading={isCreatingMedical}
      />
    );
  }

  return (
    <ModalForm icon={AddCircle} onClose={onClose}>
      <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 shrink-0 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("leaveForm.medicalForm.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("leaveForm.medicalForm.subtitle")}</p>
        </div>

        <div
          ref={scrollRef}
          className={cn("flex-1 overflow-auto flex flex-col gap-5 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
          {hasActiveLeaves && activeLeaveToastText && (
            <Toast color="notice" text={activeLeaveToastText} closable={false} autoClose={false} />
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

          <Input
            label={t("leaveForm.diagnosis.label")}
            placeholder={t("leaveForm.diagnosis.placeholder")}
            isTextarea
            {...register("diagnosis")}
            value={diagnosis || ""}
            onChange={handleDiagnosisChange}
            error={errors.diagnosis?.message ? t(errors.diagnosis.message as string) : undefined}
          />
        </div>

        <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
          <Button variant="secondary" className="py-3" onClick={onClose} type="button">
            {t("leaveForm.cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={isCreatingMedical || hasOverlaps} className="py-3">
            {isCreatingMedical ? t("leaveForm.loading") : t("leaveForm.continue")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
