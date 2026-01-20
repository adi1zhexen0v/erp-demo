import { useState } from "react";
import { useTranslation } from "react-i18next";
import { extractErrorMessage } from "@/shared/utils";
import {
  useCreateRentalPaymentMutation,
  useUpdateRentalPaymentMutation,
  useApproveRentalPaymentMutation,
  useMarkRentalPaymentPaidMutation,
  useDeleteRentalPaymentMutation,
  useExtractOCRMutation,
} from "../api";
import type {
  RentalPaymentCreateRequest,
  RentalPaymentUpdateRequest,
  RentalPaymentOCRResponse,
  BudgetLimitError,
} from "../types";
import type { PromptState } from "./useRentalModals";

export interface UseRentalMutationsReturn {
  creating: boolean;
  updatingId: number | null;
  approvingId: number | null;
  markingPaidId: number | null;
  deletingId: number | null;
  extractingOCR: boolean;
  isUpdating: boolean;
  isApproving: boolean;
  isMarkingPaid: boolean;
  isDeleting: boolean;
  handleCreate: (dto: RentalPaymentCreateRequest) => Promise<void>;
  handleUpdate: (id: number, dto: RentalPaymentUpdateRequest) => Promise<void>;
  handleApprove: (id: number) => Promise<void>;
  handleMarkPaid: (id: number) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleExtractOCR: (file: File) => Promise<RentalPaymentOCRResponse>;
  setPrompt: (state: PromptState | null) => void;
}

export function useRentalMutations(setPrompt: (state: PromptState | null) => void): UseRentalMutationsReturn {
  const { t } = useTranslation("RentalsPage");

  const [createRentalPayment] = useCreateRentalPaymentMutation();
  const [updateRentalPayment] = useUpdateRentalPaymentMutation();
  const [approveRentalPayment] = useApproveRentalPaymentMutation();
  const [markRentalPaymentPaid] = useMarkRentalPaymentPaidMutation();
  const [deleteRentalPayment] = useDeleteRentalPaymentMutation();
  const [extractOCR] = useExtractOCRMutation();

  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [extractingOCR, setExtractingOCR] = useState(false);

  const isUpdating = updatingId !== null;
  const isApproving = approvingId !== null;
  const isMarkingPaid = markingPaidId !== null;
  const isDeleting = deletingId !== null;

  async function handleCreate(dto: RentalPaymentCreateRequest) {
    if (creating) return;
    try {
      setCreating(true);
      await createRentalPayment(dto).unwrap();
      setPrompt({
        title: t("messages.createSuccessTitle"),
        text: t("messages.createSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.createErrorText", t),
        variant: "error",
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: number, dto: RentalPaymentUpdateRequest) {
    if (isUpdating) return;
    try {
      setUpdatingId(id);
      await updateRentalPayment({ id, data: dto }).unwrap();
      setPrompt({
        title: t("messages.updateSuccessTitle"),
        text: t("messages.updateSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.updateErrorText", t),
        variant: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleApprove(id: number) {
    if (isApproving) return;
    try {
      setApprovingId(id);
      await approveRentalPayment({ id }).unwrap();
      setPrompt({
        title: t("messages.approveSuccessTitle"),
        text: t("messages.approveSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = err.data as BudgetLimitError;
        if (errorData?.type === "BudgetLimitExceeded") {
          setPrompt({
            title: t("messages.budgetLimitExceededTitle"),
            text: t("messages.budgetLimitExceededText", {
              section: errorData.details.section,
              limit: errorData.details.limit,
              spent: errorData.details.spent,
              requested: errorData.details.requested,
              available: errorData.details.available,
            }),
            variant: "error",
          });
          return;
        }
      }
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.approveErrorText", t),
        variant: "error",
      });
    } finally {
      setApprovingId(null);
    }
  }

  async function handleMarkPaid(id: number) {
    if (isMarkingPaid) return;
    try {
      setMarkingPaidId(id);
      await markRentalPaymentPaid(id).unwrap();
      setPrompt({
        title: t("messages.markPaidSuccessTitle"),
        text: t("messages.markPaidSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.markPaidErrorText", t),
        variant: "error",
      });
    } finally {
      setMarkingPaidId(null);
    }
  }

  async function handleDelete(id: number) {
    if (isDeleting) return;
    try {
      setDeletingId(id);
      await deleteRentalPayment(id).unwrap();
      setPrompt({
        title: t("messages.deleteSuccessTitle"),
        text: t("messages.deleteSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.deleteErrorText", t),
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleExtractOCR(file: File): Promise<RentalPaymentOCRResponse> {
    if (extractingOCR) throw new Error("OCR extraction already in progress");
    try {
      setExtractingOCR(true);
      const result = await extractOCR(file).unwrap();
      return result;
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.ocrErrorText", t),
        variant: "error",
      });
      throw err;
    } finally {
      setExtractingOCR(false);
    }
  }

  return {
    creating,
    updatingId,
    approvingId,
    markingPaidId,
    deletingId,
    extractingOCR,
    isUpdating,
    isApproving,
    isMarkingPaid,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleExtractOCR,
    setPrompt,
  };
}

