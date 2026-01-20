import React from "react";
import { DocumentText1, Import, DocumentUpload, Edit2, TickCircle } from "iconsax-react";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";
import type { LeaveApplication, LeaveStatus, LeaveType } from "../types";

export type LeaveAction =
  | "upload_application"
  | "download_application_docx"
  | "approve"
  | "revision"
  | "reject"
  | "create_order"
  | "upload_order"
  | "download_order_docx"
  | "complete"
  | "upload_certificate";

export interface ActionConfig {
  id: LeaveAction;
  label: string;
  variant: "primary" | "secondary" | "danger";
  icon: React.ReactNode;
}

export interface LeaveActionsConfig {
  actions: ActionConfig[];
  isLoading: boolean;
}

interface IsLoadingState {
  isDownloadingApplication: boolean;
  isReviewing: boolean;
  isCreatingOrder: boolean;
  isDownloadingOrder: boolean;
  isCompleting: boolean;
  isUpdatingCertificate: boolean;
}

export function getAvailableActions(
  leave: LeaveApplication,
  isLoading: IsLoadingState,
  t: (key: string) => string,
): LeaveActionsConfig {
  const status = leave.status as LeaveStatus;
  const leaveType = leave.leave_type as LeaveType;
  const actions: ActionConfig[] = [];

  const canUploadApplication = status === "app_pending";
  const canReviewApplication = status === "app_review";
  const canCreateOrder = status === "app_approved";
  const canUploadOrder = status === "order_pending";
  const canComplete = status === "order_uploaded";
  const canDownloadApplicationDocx =
    (status === "app_pending" || status === "app_review" || status === "app_approved") &&
    (!leave.application_signed_pdf_url || leave.application_review_status === "revision");
  const canDownloadOrderDocx =
    (status === "order_pending" || status === "order_uploaded" || status === "active") &&
    !(leave.order?.pdf_url || (leave.order as { signed_pdf_url?: string } | null)?.signed_pdf_url);

  const hasCertificate =
    leaveType === "medical" && "certificate_pdf_url" in leave && leave.certificate_pdf_url !== null;
  const canUploadCertificate =
    leaveType === "medical" && (status === "order_uploaded" || status === "active") && !hasCertificate;

  if (canUploadApplication) {
    actions.push({
      id: "upload_application",
      label: t("actions.uploadApplicationScan"),
      variant: "primary",
      icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
    });
  }

  if (canDownloadApplicationDocx) {
    actions.push({
      id: "download_application_docx",
      label: isLoading.isDownloadingApplication ? t("actions.downloading") : t("actions.downloadApplicationDocx"),
      variant: "secondary",
      icon: React.createElement(Import, { size: 16, color: "currentColor" }),
    });
  }

  if (canReviewApplication) {
    actions.push(
      {
        id: "approve",
        label: isLoading.isReviewing ? t("actions.reviewing") : t("actions.approve"),
        variant: "primary",
        icon: React.createElement(CheckIcon),
      },
      {
        id: "revision",
        label: t("actions.revision"),
        variant: "secondary",
        icon: React.createElement(Edit2, { size: 16, color: "currentColor" }),
      },
      {
        id: "reject",
        label: t("actions.reject"),
        variant: "danger",
        icon: React.createElement(CloseIcon),
      },
    );
  }

  if (canCreateOrder) {
    actions.push({
      id: "create_order",
      label: isLoading.isCreatingOrder ? t("actions.creating") : t("actions.createOrder"),
      variant: "primary",
      icon: React.createElement(DocumentText1, { size: 16, color: "currentColor" }),
    });
  }

  if (canUploadOrder) {
    actions.push({
      id: "upload_order",
      label: t("actions.uploadOrder"),
      variant: "primary",
      icon: React.createElement(DocumentUpload, { size: 16, color: "currentColor" }),
    });
  }

  if (canDownloadOrderDocx) {
    actions.push({
      id: "download_order_docx",
      label: isLoading.isDownloadingOrder ? t("actions.downloading") : t("actions.downloadOrderDocx"),
      variant: "secondary",
      icon: React.createElement(Import, { size: 16, color: "currentColor" }),
    });
  }

  if (canComplete) {
    actions.push({
      id: "complete",
      label: isLoading.isCompleting ? t("actions.completing") : t("actions.complete"),
      variant: "primary",
      icon: React.createElement(TickCircle, { size: 16, color: "currentColor" }),
    });
  }

  if (canUploadCertificate) {
    actions.push({
      id: "upload_certificate",
      label: t("actions.uploadCertificate"),
      variant: "secondary",
      icon: React.createElement(DocumentUpload, { size: 16, color: "currentColor" }),
    });
  }

  const isLoadingAny =
    isLoading.isDownloadingApplication ||
    isLoading.isReviewing ||
    isLoading.isCreatingOrder ||
    isLoading.isDownloadingOrder ||
    isLoading.isCompleting ||
    isLoading.isUpdatingCertificate;

  return {
    actions,
    isLoading: isLoadingAny,
  };
}

export function canEditLeave(leave: LeaveApplication): boolean {
  const status = leave.status as LeaveStatus;
  // Согласно API документации, редактирование и удаление возможно только для статуса "draft"
  // Заявки создаются сразу со статусом "app_pending", поэтому редактирование фактически недоступно
  return status === "draft";
}

