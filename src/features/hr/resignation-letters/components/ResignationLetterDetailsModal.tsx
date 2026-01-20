import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Calendar, User, Clock, TickCircle, CloseCircle } from "iconsax-react";
import type { Icon } from "iconsax-react";
import cn from "classnames";
import {
  ModalForm,
  ModalWrapper,
  Button,
  Prompt,
  Skeleton,
  FileViewer,
  PromptForm,
  Badge,
  Select,
  type BadgeColor,
} from "@/shared/ui";
import { formatDateForDisplay, downloadBlob } from "@/shared/utils";
import { useScrollDetection } from "@/shared/hooks";
import { ReviewNoteModal } from "@/features/hr/shared";
import {
  useGetResignationLetterQuery,
  useDeleteResignationLetterMutation,
  useUpdateResignationLetterMutation,
  useSubmitResignationLetterMutation,
  useCancelResignationLetterMutation,
  usePreviewResignationApplicationMutation,
  useReviewResignationApplicationMutation,
  useCreateTerminationOrderMutation,
  usePreviewTerminationOrderMutation,
} from "../api";
import type { ResignationStatus, ApprovalResolution } from "../types";
import { getAvailableActions, type ResignationAction } from "../utils/resignationRules";
import UploadApplicationModal from "./UploadApplicationModal";
import UploadOrderModal from "./UploadOrderModal";

interface Props {
  resignationId: number;
  onClose: () => void;
}

interface ResignationField {
  key: string;
  label: string;
  value: string;
  icon: Icon;
  isStatus?: boolean;
  statusComponent?: ReactNode;
}

function ResignationDetailsSkeleton() {
  const { scrollRef, hasScroll } = useScrollDetection();
  return (
    <div className="flex flex-col gap-6 h-full min-h-0">
      <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
        <Skeleton height={28} width={240} />
      </div>
      <div ref={scrollRef} className={cn("flex-1 overflow-auto min-h-0 page-scroll", hasScroll && "pr-3")}>
        <div className="flex flex-col py-4">
          <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
            <Skeleton height={24} width={200} />
            <Skeleton height={32} width={150} />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="py-3 border-b surface-base-stroke">
                <Skeleton height={20} width="100%" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Skeleton height={44} width="100%" />
    </div>
  );
}

function getStatusDisplayInfo(status: ResignationStatus): {
  color: BadgeColor;
  translationKey: string;
  icon: React.ReactNode;
} {
  const statusMap: Record<ResignationStatus, { color: BadgeColor; translationKey: string; icon: React.ReactNode }> = {
    draft: {
      color: "info",
      translationKey: "resignationLetter.statusLabels.draft",
      icon: <DocumentText1 size={14} color="currentColor" />,
    },
    app_pending: {
      color: "notice",
      translationKey: "resignationLetter.statusLabels.app_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    app_review: {
      color: "notice",
      translationKey: "resignationLetter.statusLabels.app_review",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    app_approved: {
      color: "notice",
      translationKey: "resignationLetter.statusLabels.app_approved",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    order_pending: {
      color: "notice",
      translationKey: "resignationLetter.statusLabels.order_pending",
      icon: <Clock size={14} color="currentColor" variant="Bold" />,
    },
    order_uploaded: {
      color: "positive",
      translationKey: "resignationLetter.statusLabels.order_uploaded",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    completed: {
      color: "positive",
      translationKey: "resignationLetter.statusLabels.completed",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    cancelled: {
      color: "negative",
      translationKey: "resignationLetter.statusLabels.cancelled",
      icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
    },
  };
  return (
    statusMap[status] || {
      color: "info",
      translationKey: `resignationLetter.statusLabels.${status}`,
      icon: <DocumentText1 size={14} color="currentColor" />,
    }
  );
}

export default function ResignationLetterDetailsModal({ resignationId, onClose }: Props) {
  const { t } = useTranslation("ContractsPage");
  const { scrollRef, hasScroll } = useScrollDetection();

  const { data: resignation, isLoading, isError } = useGetResignationLetterQuery(resignationId);
  const [deleteResignation, { isLoading: isDeleting }] = useDeleteResignationLetterMutation();
  const [updateResignation, { isLoading: isUpdating }] = useUpdateResignationLetterMutation();
  const [submitResignation, { isLoading: isSubmitting }] = useSubmitResignationLetterMutation();
  const [cancelResignation, { isLoading: isCancelling }] = useCancelResignationLetterMutation();
  const [previewApplication, { isLoading: isDownloadingApplication }] = usePreviewResignationApplicationMutation();
  const [reviewApplication, { isLoading: isReviewing }] = useReviewResignationApplicationMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateTerminationOrderMutation();
  const [previewOrder, { isLoading: isDownloadingOrder }] = usePreviewTerminationOrderMutation();

  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);
  const [showUploadApplication, setShowUploadApplication] = useState(false);
  const [showUploadOrder, setShowUploadOrder] = useState(false);
  const [showApprovePrompt, setShowApprovePrompt] = useState(false);
  const [showReviewNoteModal, setShowReviewNoteModal] = useState(false);
  const [selectedReviewAction, setSelectedReviewAction] = useState<"revision" | "reject" | null>(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedResolution, setEditedResolution] = useState<ApprovalResolution | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  function handleShowConfirmSubmit() {
    setShowConfirmSubmit(true);
  }

  async function handleConfirmSubmit() {
    if (isSubmitting) return;

    try {
      await submitResignation(resignationId).unwrap();
      setShowConfirmSubmit(false);
      setPrompt({
        title: t("resignationLetter.actions.submitSuccessTitle"),
        text: t("resignationLetter.actions.submitSuccessText"),
        variant: "success",
      });
    } catch {
      setShowConfirmSubmit(false);
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.submitError"),
        variant: "error",
      });
    }
  }

  async function handleDelete() {
    if (isDeleting) return;

    try {
      await deleteResignation(resignationId).unwrap();
      onClose();
    } catch {
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.deleteError"),
        variant: "error",
      });
    }
  }

  async function handleCancel() {
    if (isCancelling) return;

    try {
      await cancelResignation(resignationId).unwrap();
      setShowCancelPrompt(false);
      setPrompt({
        title: t("resignationLetter.actions.cancelSuccessTitle"),
        text: t("resignationLetter.actions.cancelSuccessText"),
        variant: "success",
      });
    } catch {
      setShowCancelPrompt(false);
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.cancelError"),
        variant: "error",
      });
    }
  }

  async function handleCreateOrder() {
    if (isCreatingOrder) return;

    try {
      await createOrder(resignationId).unwrap();
      setPrompt({
        title: t("resignationLetter.actions.orderCreatedTitle"),
        text: t("resignationLetter.actions.orderCreatedText"),
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.orderCreateError"),
        variant: "error",
      });
    }
  }

  function handleUploadSuccess() {
    setShowUploadApplication(false);
    setShowUploadOrder(false);
    setPrompt({
      title: t("resignationLetter.actions.successTitle"),
      text: t("resignationLetter.actions.uploadSuccess"),
      variant: "success",
    });
  }

  function handleApprove() {
    setShowApprovePrompt(true);
  }

  async function handleApproveConfirm() {
    if (isReviewing) return;

    try {
      await reviewApplication({
        id: resignationId,
        data: { action: "approve" },
      }).unwrap();
      setShowApprovePrompt(false);
      setPrompt({
        title: t("resignationLetter.actions.approveSuccessTitle"),
        text: t("resignationLetter.actions.approveSuccessText"),
        variant: "success",
      });
    } catch {
      setShowApprovePrompt(false);
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.reviewError"),
        variant: "error",
      });
    }
  }

  function handleReviewAction(action: "revision" | "reject") {
    setSelectedReviewAction(action);
    setShowReviewNoteModal(true);
  }

  async function handleReviewWithNote(note: string) {
    if (!selectedReviewAction || isReviewing) return;

    try {
      await reviewApplication({
        id: resignationId,
        data: { action: selectedReviewAction, note: note.trim() || undefined },
      }).unwrap();
      setShowReviewNoteModal(false);
      setSelectedReviewAction(null);
      setPrompt({
        title: t("resignationLetter.actions.reviewSuccessTitle"),
        text: t("resignationLetter.actions.reviewSuccessText"),
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.reviewError"),
        variant: "error",
      });
    }
  }

  async function handleDownloadApplicationDocx() {
    if (isDownloadingApplication) return;

    try {
      const blob = await previewApplication(resignationId).unwrap();
      downloadBlob(blob, t("downloads.resignationApplicationFileName", { resignationId }));
    } catch {
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.downloadApplicationDocxError"),
        variant: "error",
      });
    }
  }

  async function handleDownloadOrderDocx() {
    if (isDownloadingOrder) return;

    try {
      const blob = await previewOrder(resignationId).unwrap();
      downloadBlob(blob, t("downloads.resignationOrderFileName", { resignationId }));
    } catch {
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.downloadOrderDocxError"),
        variant: "error",
      });
    }
  }

  function handleOpenEditModal() {
    setEditedResolution((resignation?.approval_resolution as ApprovalResolution) || null);
    setShowEditModal(true);
  }

  async function handleSaveResolution() {
    if (isUpdating) return;

    try {
      await updateResignation({
        id: resignationId,
        data: { approval_resolution: editedResolution || undefined },
      }).unwrap();
      setShowEditModal(false);
      setPrompt({
        title: t("resignationLetter.actions.successTitle"),
        text: t("resignationLetter.actions.updateSuccess"),
        variant: "success",
      });
    } catch {
      setPrompt({
        title: t("resignationLetter.actions.errorTitle"),
        text: t("resignationLetter.actions.updateError"),
        variant: "error",
      });
    }
  }

  if (isLoading) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <ResignationDetailsSkeleton />
      </ModalForm>
    );
  }

  if (isError || !resignation) {
    return (
      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">
              {t("resignationLetter.title")}
            </h4>
          </div>
          <div ref={scrollRef} className={cn("flex-1 overflow-auto min-h-0 flex items-center justify-center page-scroll", hasScroll && "pr-3")}>
            <p className="text-body-regular-md content-action-negative">
              {t("resignationLetter.loadError")}
            </p>
          </div>
        </div>
      </ModalForm>
    );
  }

  const status = resignation.status;

  function getStatusBadge(status: ResignationStatus) {
    const info = getStatusDisplayInfo(status);
    const translatedText = t(info.translationKey);
    const displayText = translatedText === info.translationKey ? status : translatedText;
    return <Badge variant="soft" color={info.color} text={displayText} icon={info.icon} />;
  }

  const { actions } = getAvailableActions(
    resignation,
    {
      isSubmitting,
      isDownloadingApplication,
      isReviewing,
      isCreatingOrder,
      isDownloadingOrder,
      isUpdating,
      isCancelling,
      isDeleting,
    },
    t,
  );

  const shouldShowApplicationPdf = !!resignation.application_signed_pdf_url;
  const shouldShowOrderPdf = !!resignation.order?.signed_pdf_url;

  function handleAction(action: ResignationAction) {
    switch (action) {
      case "submit":
        handleShowConfirmSubmit();
        break;
      case "upload_application":
        setShowUploadApplication(true);
        break;
      case "download_application_docx":
        handleDownloadApplicationDocx();
        break;
      case "approve":
        handleApprove();
        break;
      case "revision":
        handleReviewAction("revision");
        break;
      case "reject":
        handleReviewAction("reject");
        break;
      case "create_order":
        handleCreateOrder();
        break;
      case "upload_order":
        setShowUploadOrder(true);
        break;
      case "download_order_docx":
        handleDownloadOrderDocx();
        break;
      case "edit":
        handleOpenEditModal();
        break;
      case "cancel":
        setShowCancelPrompt(true);
        break;
      case "delete":
        setShowDeletePrompt(true);
        break;
    }
  }

  function handlePromptClose() {
    setPrompt(null);
  }

  function handleReviewNoteModalClose() {
    setShowReviewNoteModal(false);
    setSelectedReviewAction(null);
  }

  function filterField(field: ResignationField): boolean {
    return !!(field.value || field.isStatus);
  }

  function renderField(field: ResignationField, index: number, array: ResignationField[]) {
    const IconComponent = field.icon;
    return (
      <div
        key={field.key}
        className={cn("py-3 flex items-center gap-3", index < array.length - 1 && "border-b surface-base-stroke")}>
        <span className="content-action-brand">
          <IconComponent size={16} color="currentColor" />
        </span>
        <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">{field.label}</span>
        {field.isStatus ? (
          <div className="flex justify-end">{field.statusComponent}</div>
        ) : (
          <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
        )}
      </div>
    );
  }

  const fields: ResignationField[] = [
    {
      key: "status",
      label: t("resignationLetter.status"),
      value: "",
      icon: DocumentText1,
      isStatus: true,
      statusComponent: getStatusBadge(status),
    },
    {
      key: "lastWorkingDay",
      label: t("resignationLetter.lastWorkingDay"),
      value: resignation.last_working_day ? formatDateForDisplay(resignation.last_working_day, false) : "",
      icon: Calendar,
    },
    {
      key: "approvalResolution",
      label: t("resignationLetter.approvalResolution"),
      value: resignation.approval_resolution_display || "",
      icon: DocumentText1,
    },
    {
      key: "worker",
      label: t("resignationLetter.worker"),
      value: resignation.worker?.full_name || "",
      icon: User,
    },
    {
      key: "createdBy",
      label: t("resignationLetter.createdBy"),
      value: resignation.created_by?.full_name || "",
      icon: User,
    },
    {
      key: "createdAt",
      label: t("resignationLetter.createdAt"),
      value: resignation.created_at ? formatDateForDisplay(resignation.created_at, true) : "",
      icon: Calendar,
    },
  ];

  if (status === "cancelled" && resignation.application_review_note) {
    fields.push({
      key: "reviewNote",
      label: t("resignationLetter.reviewNote"),
      value: resignation.application_review_note,
      icon: DocumentText1,
    });
  }

  const filteredFields = fields.filter(filterField);

  return (
    <>
      {showConfirmSubmit && (
        <PromptForm
          variant="warning"
          onClose={() => setShowConfirmSubmit(false)}
          onConfirm={handleConfirmSubmit}
          title={t("prompt_form.title")}
          text={t("prompt_form.description")}
          isLoading={isSubmitting}
          namespace="ContractsPage"
        />
      )}

      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={handlePromptClose}
          namespace="ContractsPage"
        />
      )}

      {showDeletePrompt && (
        <PromptForm
          title={t("resignationLetter.actions.deleteConfirmTitle")}
          text={t("resignationLetter.actions.deleteConfirmText")}
          confirmText={t("buttons.delete")}
          cancelText={t("buttons.cancel")}
          onConfirm={handleDelete}
          onClose={() => setShowDeletePrompt(false)}
          isLoading={isDeleting}
          variant="error"
        />
      )}

      {showCancelPrompt && (
        <PromptForm
          title={t("resignationLetter.actions.cancelConfirmTitle")}
          text={t("resignationLetter.actions.cancelConfirmText")}
          confirmText={t("buttons.confirm")}
          cancelText={t("buttons.cancel")}
          onConfirm={handleCancel}
          onClose={() => setShowCancelPrompt(false)}
          isLoading={isCancelling}
          variant="error"
        />
      )}

      {showApprovePrompt && (
        <PromptForm
          title={t("resignationLetter.actions.approveConfirmTitle")}
          text={t("resignationLetter.actions.approveConfirmText")}
          confirmText={t("buttons.approve")}
          cancelText={t("buttons.cancel")}
          onConfirm={handleApproveConfirm}
          onClose={() => setShowApprovePrompt(false)}
          isLoading={isReviewing}
          variant="success"
        />
      )}

      {showUploadApplication && (
        <UploadApplicationModal
          resignationId={resignationId}
          onClose={() => setShowUploadApplication(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showUploadOrder && (
        <UploadOrderModal
          resignationId={resignationId}
          onClose={() => setShowUploadOrder(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {showReviewNoteModal && selectedReviewAction && (
        <ReviewNoteModal
          action={selectedReviewAction}
          onClose={handleReviewNoteModalClose}
          onSubmit={handleReviewWithNote}
          isSubmitting={isReviewing}
          namespace="ContractsPage"
          translationPrefix="resignationLetter.review"
        />
      )}

      {showEditModal && (
        <ModalWrapper onClose={() => setShowEditModal(false)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 border-b surface-base-stroke pb-3">
              <h4 className="text-display-2xs content-base-primary">
                {t("resignationLetter.actions.editTitle")}
              </h4>
            </div>

            <Select
              label={t("resignationLetter.approvalResolution")}
              placeholder={t("resignationLetter.selectResolution")}
              options={[
                {
                  label: t("resignationForm.approval_resolution.approved_with_1month"),
                  value: "approved_with_1month",
                },
                { label: t("resignationForm.approval_resolution.approved"), value: "approved" },
                {
                  label: t("resignationForm.approval_resolution.no_objection"),
                  value: "no_objection",
                },
              ]}
              value={editedResolution}
              onChange={(v) => setEditedResolution(v as ApprovalResolution)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md" onClick={() => setShowEditModal(false)} disabled={isUpdating}>
                {t("buttons.cancel")}
              </Button>
              <Button variant="primary" size="md" onClick={handleSaveResolution} disabled={isUpdating}>
                {isUpdating ? t("buttons.saving") : t("buttons.save")}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      <ModalForm icon={DocumentText1} onClose={onClose} resize={false} allowCloseInOverlay={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">
              {t("resignationLetter.title")}
            </h4>
          </div>

          <div ref={scrollRef} className={cn("flex-1 overflow-auto min-h-0 p-1 page-scroll", hasScroll && "pr-3")}>
            <div className="flex flex-col py-4">
              <div className="flex flex-col gap-2 mb-4 border-b surface-base-stroke pb-3">
                <p className="text-body-bold-lg content-base-primary">
                  {t("resignationLetter.prefix")} №{resignation.id}
                </p>
              </div>

              <div className="flex flex-col">{filteredFields.map(renderField)}</div>

              {shouldShowApplicationPdf && (
                <div className="mt-4 border-t surface-base-stroke pt-4">
                  <p className="text-body-bold-md content-base-primary mb-2">
                    {t("resignationLetter.applicationPdf")}
                  </p>
                  <FileViewer existingFileUrl={resignation.application_signed_pdf_url} />
                </div>
              )}

              {shouldShowOrderPdf && (
                <div className="mt-4 border-t surface-base-stroke pt-4">
                  <p className="text-body-bold-md content-base-primary mb-2">
                    {t("resignationLetter.orderPdf")}
                  </p>
                  <FileViewer existingFileUrl={resignation.order!.signed_pdf_url} />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-0.5 shrink-0 p-1">
            {actions.map((action) => {
              const isDisabled =
                (action.id === "submit" && isSubmitting) ||
                (action.id === "download_application_docx" && isDownloadingApplication) ||
                (action.id === "approve" && isReviewing) ||
                (action.id === "revision" && isReviewing) ||
                (action.id === "reject" && isReviewing) ||
                (action.id === "create_order" && isCreatingOrder) ||
                (action.id === "download_order_docx" && isDownloadingOrder) ||
                (action.id === "edit" && isUpdating) ||
                (action.id === "cancel" && isCancelling) ||
                (action.id === "delete" && isDeleting);

              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="md"
                  disabled={isDisabled}
                  onClick={() => handleAction(action.id)}>
                  {action.icon}
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </ModalForm>
    </>
  );
}
