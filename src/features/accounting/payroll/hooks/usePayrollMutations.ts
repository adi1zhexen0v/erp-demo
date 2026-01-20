import { useState } from "react";
import { useTranslation } from "react-i18next";
import { extractErrorMessage } from "@/shared/utils";
import {
  useGeneratePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useDeletePayrollMutation,
  useRecalculatePayrollMutation,
  useApproveGPHMutation,
  useMarkGPHPaidMutation,
} from "../api";
import type { GeneratePayrollDto, ApprovePayrollDto, MarkPaidDto, ApproveGPHDto } from "../types";
import type { PromptState } from "./usePayrollModals";

export interface UsePayrollMutationsReturn {
  generating: boolean;
  approvingId: number | null;
  markingPaidId: number | null;
  deletingId: number | null;
  recalculatingId: number | null;
  approvingGPHId: number | null;
  markingGPHPaidId: number | null;
  isApproving: boolean;
  isMarkingPaid: boolean;
  isDeleting: boolean;
  isRecalculating: boolean;
  isApprovingGPH: boolean;
  isMarkingGPHPaid: boolean;
  handleGenerate: (dto: GeneratePayrollDto) => Promise<void>;
  handleApprove: (id: number, dto?: ApprovePayrollDto) => Promise<void>;
  handleMarkPaid: (id: number, dto?: MarkPaidDto) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleRecalculate: (id: number) => Promise<number | undefined>;
  handleApproveGPH: (id: number, dto?: ApproveGPHDto) => Promise<void>;
  handleMarkGPHPaid: (id: number, dto?: MarkPaidDto, skipPrompt?: boolean) => Promise<void>;
  setPrompt: (state: PromptState | null) => void;
}

export function usePayrollMutations(setPrompt: (state: PromptState | null) => void): UsePayrollMutationsReturn {
  const { t } = useTranslation("PayrollPage");

  const [generatePayroll] = useGeneratePayrollMutation();
  const [approvePayroll] = useApprovePayrollMutation();
  const [markPayrollPaid] = useMarkPayrollPaidMutation();
  const [deletePayroll] = useDeletePayrollMutation();
  const [recalculatePayroll] = useRecalculatePayrollMutation();
  const [approveGPH] = useApproveGPHMutation();
  const [markGPHPaid] = useMarkGPHPaidMutation();

  const [generating, setGenerating] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [recalculatingId, setRecalculatingId] = useState<number | null>(null);
  const [approvingGPHId, setApprovingGPHId] = useState<number | null>(null);
  const [markingGPHPaidId, setMarkingGPHPaidId] = useState<number | null>(null);

  const isApproving = approvingId !== null;
  const isMarkingPaid = markingPaidId !== null;
  const isDeleting = deletingId !== null;
  const isRecalculating = recalculatingId !== null;
  const isApprovingGPH = approvingGPHId !== null;
  const isMarkingGPHPaid = markingGPHPaidId !== null;

  async function handleGenerate(dto: GeneratePayrollDto) {
    if (generating) return;
    try {
      setGenerating(true);
      await generatePayroll(dto).unwrap();
      setPrompt({
        title: t("messages.generateSuccessTitle"),
        text: t("messages.generateSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.generateErrorText", t),
        variant: "error",
      });
    } finally {
      setGenerating(false);
    }
  }

  async function handleApprove(id: number, dto?: ApprovePayrollDto) {
    if (isApproving) return;
    try {
      setApprovingId(id);
      await approvePayroll({ id, body: dto }).unwrap();
      setPrompt({
        title: t("messages.approveSuccessTitle"),
        text: t("messages.approveSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.approveErrorText", t),
        variant: "error",
      });
    } finally {
      setApprovingId(null);
    }
  }

  async function handleMarkPaid(id: number, dto?: MarkPaidDto) {
    if (isMarkingPaid) return;
    try {
      setMarkingPaidId(id);
      await markPayrollPaid({ id, body: dto }).unwrap();
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
      throw err;
    } finally {
      setMarkingPaidId(null);
    }
  }

  async function handleDelete(id: number) {
    if (isDeleting) return;
    try {
      setDeletingId(id);
      await deletePayroll(id).unwrap();
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

  async function handleRecalculate(id: number): Promise<number | undefined> {
    if (isRecalculating) return undefined;
    try {
      setRecalculatingId(id);
      const result = await recalculatePayroll(id).unwrap();
      setPrompt({
        title: t("messages.recalculateSuccessTitle"),
        text: t("messages.recalculateSuccessText"),
        variant: "success",
      });
      return result.id;
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.recalculateErrorText", t),
        variant: "error",
      });
      return undefined;
    } finally {
      setRecalculatingId(null);
    }
  }

  async function handleApproveGPH(id: number, dto?: ApproveGPHDto) {
    if (isApprovingGPH) return;
    try {
      setApprovingGPHId(id);
      await approveGPH({ id, body: dto }).unwrap();
      setPrompt({
        title: t("messages.gphApproveSuccessTitle"),
        text: t("messages.gphApproveSuccessText"),
        variant: "success",
      });
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.gphApproveErrorText", t),
        variant: "error",
      });
      throw err;
    } finally {
      setApprovingGPHId(null);
    }
  }

  async function handleMarkGPHPaid(id: number, dto?: MarkPaidDto, skipPrompt?: boolean) {
    if (isMarkingGPHPaid) return;
    try {
      setMarkingGPHPaidId(id);
      await markGPHPaid({ id, body: dto }).unwrap();
      if (!skipPrompt) {
        setPrompt({
          title: t("messages.gphMarkPaidSuccessTitle"),
          text: t("messages.gphMarkPaidSuccessText"),
          variant: "success",
        });
      }
    } catch (err: unknown) {
      setPrompt({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.gphMarkPaidErrorText", t),
        variant: "error",
      });
      throw err;
    } finally {
      setMarkingGPHPaidId(null);
    }
  }

  return {
    generating,
    approvingId,
    markingPaidId,
    deletingId,
    recalculatingId,
    approvingGPHId,
    markingGPHPaidId,
    isApproving,
    isMarkingPaid,
    isDeleting,
    isRecalculating,
    isApprovingGPH,
    isMarkingGPHPaid,
    handleGenerate,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleRecalculate,
    handleApproveGPH,
    handleMarkGPHPaid,
    setPrompt,
  };
}

