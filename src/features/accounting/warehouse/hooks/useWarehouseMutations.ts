import { useState } from "react";
import { useTranslation } from "react-i18next";
import { extractErrorMessage } from "@/shared/utils";
import {
  useAssignUnitMutation,
  useReturnUnitMutation,
  useWriteOffUnitMutation,
} from "../api";
import type { AssignItemDto, ReturnItemDto, WriteOffItemDto } from "../types";
import type { PromptState } from "./useWarehouseModals";

export interface UseWarehouseMutationsReturn {
  assigningId: number | null;
  returningId: number | null;
  writingOffId: number | null;
  isAssigning: boolean;
  isReturning: boolean;
  isWritingOff: boolean;
  handleAssign: (id: number, dto: AssignItemDto) => Promise<void>;
  handleReturn: (id: number, dto?: ReturnItemDto) => Promise<void>;
  handleWriteOff: (id: number, dto: WriteOffItemDto) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function useWarehouseMutations(setPrompt: (state: PromptState | null) => void): UseWarehouseMutationsReturn {
  const { t } = useTranslation("WarehousePage");

  const [assignUnit] = useAssignUnitMutation();
  const [returnUnit] = useReturnUnitMutation();
  const [writeOffUnit] = useWriteOffUnitMutation();

  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [writingOffId, setWritingOffId] = useState<number | null>(null);

  const isAssigning = assigningId !== null;
  const isReturning = returningId !== null;
  const isWritingOff = writingOffId !== null;

  async function handleAssign(id: number, dto: AssignItemDto) {
    if (isAssigning) return;
    try {
      setAssigningId(id);
      await assignUnit({ id, body: dto }).unwrap();
      setPrompt({
        title: t("messages.assignSuccessTitle"),
        text: t("messages.assignSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.assignErrorText", t),
        variant: "error",
      });
    } finally {
      setAssigningId(null);
    }
  }

  async function handleReturn(id: number, dto?: ReturnItemDto) {
    if (isReturning) return;
    try {
      setReturningId(id);
      await returnUnit({ id, body: dto }).unwrap();
      setPrompt({
        title: t("messages.returnSuccessTitle"),
        text: t("messages.returnSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.returnErrorText", t),
        variant: "error",
      });
    } finally {
      setReturningId(null);
    }
  }

  async function handleWriteOff(id: number, dto: WriteOffItemDto) {
    if (isWritingOff) return;
    try {
      setWritingOffId(id);
      await writeOffUnit({ id, body: dto }).unwrap();
      setPrompt({
        title: t("messages.writeOffSuccessTitle"),
        text: t("messages.writeOffSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.writeOffErrorText", t),
        variant: "error",
      });
    } finally {
      setWritingOffId(null);
    }
  }

  return {
    assigningId,
    returningId,
    writingOffId,
    isAssigning,
    isReturning,
    isWritingOff,
    handleAssign,
    handleReturn,
    handleWriteOff,
    setPrompt,
  };
}


