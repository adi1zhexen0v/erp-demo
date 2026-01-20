import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DocumentText1,
  Calendar,
  Profile,
  Briefcase,
  TickCircle,
  CloseCircle,
  DocumentUpload,
  Clock,
  Trash,
  Send2,
} from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Prompt, Badge, FileViewer, PromptForm } from "@/shared/ui";
import type { BadgeColor } from "@/shared/ui/Badge";
import { formatPrice, formatDateForDisplay } from "@/shared/utils";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { useScrollDetection } from "@/shared/hooks";
import { useGetCompletionActQuery } from "../api";
import type { CompletionActStatus } from "../types";
import { getAvailableActions } from "../utils";
import CompletionActDetailModalSkeleton from "./CompletionActDetailModalSkeleton";

interface Props {
  id: number;
  onClose: () => void;
  onUpload: (id: number, file: File) => Promise<void>;
  onSubmit: (id: number) => Promise<void>;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
  isLoading?: {
    isUploading?: boolean;
    isSubmitting?: boolean;
    isApproving?: boolean;
    isDeleting?: boolean;
  };
  hasBackground?: boolean;
}

function StatusBadge({ status }: { status: CompletionActStatus }) {
  const { t } = useTranslation("LegalApplicationsPage");

  const statusConfig: Record<CompletionActStatus, { color: BadgeColor; icon: React.ReactElement }> = {
    draft: {
      color: "info",
      icon: <DocumentText1 size={14} color="currentColor" />,
    },
    pending_review: {
      color: "notice",
      icon: <Clock size={14} color="currentColor" />,
    },
    approved: {
      color: "positive",
      icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
    },
    rejected: {
      color: "negative",
      icon: <CloseCircle size={14} color="currentColor" />,
    },
  };

  const config = statusConfig[status];
  const label = t(`completionAct.status.${status}`);

  return <Badge variant="soft" color={config.color} text={label} icon={config.icon} />;
}

export default function CompletionActDetailModal({
  id,
  onClose,
  onUpload,
  onSubmit,
  onApprove,
  onReject,
  onDelete,
  isLoading = {},
  hasBackground = true,
}: Props) {
  const { scrollRef, hasScroll } = useScrollDetection();
  const { t } = useTranslation("LegalApplicationsPage");
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: act, isLoading: isLoadingAct } = useGetCompletionActQuery(id);

  if (isLoadingAct || !act) {
    return <CompletionActDetailModalSkeleton onClose={onClose} hasBackground={hasBackground} />;
  }

  const actions = getAvailableActions(act, t);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        return;
      }
      if (isLoading.isUploading) return;
      onUpload(id, file);
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  const infoFields = [
    {
      key: "executor",
      label: t("completionAct.fields.executor"),
      value: act.parent_contract.executor_full_name,
      icon: Profile,
    },
    {
      key: "service",
      label: t("completionAct.fields.service"),
      value: act.service_item.service_name,
      icon: Briefcase,
    },
    {
      key: "period",
      label: t("completionAct.fields.period"),
      value: `${formatDateForDisplay(act.period_start_date, false)} — ${formatDateForDisplay(act.period_end_date, false)}`,
      icon: Calendar,
    },
    {
      key: "amount",
      label: t("completionAct.fields.amount"),
      value: `${formatPrice(act.amount)} ₸`,
      icon: TengeCircleIcon,
    },
    {
      key: "createdAt",
      label: t("completionAct.createdAt"),
      value: formatDateForDisplay(act.created_at, false),
      icon: Calendar,
    },
    {
      key: "status",
      label: t("filters.status"),
      value: null,
      icon: DocumentText1,
      customRender: <StatusBadge status={act.status} />,
    },
    ...(act.status === "rejected" && act.rejection_reason
      ? [
          {
            key: "rejectionReason",
            label: t("completionAct.rejectionReason"),
            value: act.rejection_reason,
            icon: CloseCircle,
          },
        ]
      : []),
    ...(act.has_document && act.document_url
      ? [
          {
            key: "document",
            label: t("completionAct.fields.uploadedDocument"),
            value: "",
            icon: DocumentText1,
            isPdfFile: true as const,
          },
        ]
      : []),
  ];

  return (
    <>
      <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />

      {showConfirmSubmit && (
        <PromptForm
          variant="warning"
          onClose={() => setShowConfirmSubmit(false)}
          onConfirm={async () => {
            if (isLoading.isSubmitting) return;
            await onSubmit(id);
            setShowConfirmSubmit(false);
          }}
          title={t("prompt_form.title")}
          text={t("prompt_form.description")}
          isLoading={isLoading.isSubmitting}
          namespace="LegalApplicationsPage"
        />
      )}

      {isLoading.isUploading && (
        <Prompt
          loaderMode={true}
          onClose={() => {}}
          title=""
          text=""
          loaderText={t("messages.loader.uploading.text")}
          additionalText={t("messages.loader.uploading.additionalText")}
          namespace="LegalApplicationsPage"
        />
      )}

      <ModalForm
        icon={DocumentText1}
        onClose={onClose}
        resize={false}
        allowCloseInOverlay={false}
        hasBackground={hasBackground}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{act.display_number}</h4>
          </div>

          <div ref={scrollRef} className={cn("flex-1 overflow-auto min-h-0 p-1 page-scroll", hasScroll && "pr-3")}>
            <div className="flex flex-col">
              {infoFields.map((field, index, array) => {
                if (field.isPdfFile && act.has_document && act.document_url) {
                  return (
                    <div
                      key={field.key}
                      className={cn(
                        "py-3 flex flex-col gap-3",
                        index < array.length - 1 && "border-b surface-base-stroke",
                      )}>
                      <div className="flex items-center gap-3">
                        {field.icon && (
                          <span className="content-action-brand">
                            <field.icon size={16} color="currentColor" />
                          </span>
                        )}
                        <span className="text-body-regular-md content-base-secondary">{field.label}</span>
                      </div>
                      <FileViewer existingFileUrl={act.document_url} />
                    </div>
                  );
                }
                return (
                  <div
                    key={field.key}
                    className={cn(
                      "py-3 flex items-center gap-3",
                      index < array.length - 1 && "border-b surface-base-stroke",
                    )}>
                    {field.icon && (
                      <span className="content-action-brand">
                        {field.icon === TengeCircleIcon ? (
                          <TengeCircleIcon size={16} />
                        ) : (
                          <field.icon size={16} color="currentColor" />
                        )}
                      </span>
                    )}
                    <span className="text-body-regular-md content-base-secondary flex-1 min-w-[120px]">
                      {field.label}
                    </span>
                    {field.customRender ? (
                      <div className="text-right">{field.customRender}</div>
                    ) : (
                      <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {act.description && (
              <div className="mt-4 p-3 radius-sm surface-component-fill">
                <span className="text-body-bold-xs content-base-secondary block mb-1">
                  {t("completionAct.fields.description")}
                </span>
                <p className="text-body-regular-sm content-base-primary">{act.description}</p>
              </div>
            )}
          </div>

          {(actions.canUpload || actions.canSubmit || actions.canApprove || actions.canDelete) && (
            <div className="flex flex-col gap-2 pt-4 border-t surface-base-stroke p-1">
              {actions.canUpload && !act.has_document && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleUploadClick}
                  disabled={isLoading.isUploading}>
                  <DocumentUpload size={16} color="currentColor" />
                  {t("completionAct.actions.uploadDocument")}
                </Button>
              )}

              {actions.canSubmit && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setShowConfirmSubmit(true)}
                  disabled={isLoading.isSubmitting}>
                  <Send2 size={16} color="currentColor" />
                  {isLoading.isSubmitting ? t("completionAct.actions.submitting") : t("completionAct.actions.submit")}
                </Button>
              )}

              {actions.canApprove && (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      if (isLoading.isApproving) return;
                      onApprove(id);
                    }}
                    disabled={isLoading.isApproving}>
                    <TickCircle size={16} color="currentColor" />
                    {isLoading.isApproving ? t("completionAct.actions.approving") : t("completionAct.actions.approve")}
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      if (isLoading.isApproving) return;
                      onReject(id);
                    }}
                    disabled={isLoading.isApproving}>
                    <CloseCircle size={16} color="currentColor" />
                    {t("completionAct.actions.reject")}
                  </Button>
                </>
              )}

              {actions.canDelete && (
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    if (isLoading.isDeleting) return;
                    onDelete(id);
                  }}
                  disabled={isLoading.isDeleting}>
                  <Trash size={16} color="currentColor" />
                  {isLoading.isDeleting ? t("completionAct.actions.deleting") : t("completionAct.actions.delete")}
                </Button>
              )}
            </div>
          )}
        </div>
      </ModalForm>
    </>
  );
}

