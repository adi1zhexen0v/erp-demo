import { useState } from "react";
import type { RentalPaymentListItem } from "../types";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export function useRentalModals() {
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<RentalPaymentListItem | null>(null);
  const [detailModal, setDetailModal] = useState<RentalPaymentListItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmApprove, setConfirmApprove] = useState<number | null>(null);
  const [confirmMarkPaid, setConfirmMarkPaid] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    createModal,
    setCreateModal,
    editModal,
    setEditModal,
    detailModal,
    setDetailModal,
    confirmDelete,
    setConfirmDelete,
    confirmApprove,
    setConfirmApprove,
    confirmMarkPaid,
    setConfirmMarkPaid,
    prompt,
    setPrompt,
  };
}

