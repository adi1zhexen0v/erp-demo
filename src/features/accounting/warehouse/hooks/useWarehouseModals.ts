import { useState } from "react";
import type { InventoryUnit } from "../types";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export function useWarehouseModals() {
  const [assignModal, setAssignModal] = useState<InventoryUnit | null>(null);
  const [detailsModal, setDetailsModal] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmWriteOff, setConfirmWriteOff] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    assignModal,
    setAssignModal,
    detailsModal,
    setDetailsModal,
    confirmDelete,
    setConfirmDelete,
    confirmWriteOff,
    setConfirmWriteOff,
    prompt,
    setPrompt,
  };
}


