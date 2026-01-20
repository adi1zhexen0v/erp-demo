export type DraftApprovedPaidStatus = "draft" | "approved" | "paid";

export function canEditDraftApprovedPaid(status: DraftApprovedPaidStatus): boolean {
  return status === "draft";
}

export function canApproveDraftApprovedPaid(status: DraftApprovedPaidStatus): boolean {
  return status === "draft";
}

export function canMarkPaidDraftApprovedPaid(status: DraftApprovedPaidStatus): boolean {
  return status === "approved";
}

export function canDeleteDraftApprovedPaid(status: DraftApprovedPaidStatus): boolean {
  return status === "draft";
}

