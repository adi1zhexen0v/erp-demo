import { useState } from "react";
import type { GroupedPurchase } from "../types";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export function usePurchasesModals() {
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<GroupedPurchase | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmApprove, setConfirmApprove] = useState<string | null>(null);
  const [confirmMarkPaid, setConfirmMarkPaid] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    createModal,
    setCreateModal,
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
