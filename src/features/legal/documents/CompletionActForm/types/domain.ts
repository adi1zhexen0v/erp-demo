import i18n from "i18next";

export type CompletionActStatus = "draft" | "pending_review" | "approved" | "rejected";

export type CompletionActAction =
  | "edit"
  | "upload_document"
  | "submit"
  | "approve"
  | "reject"
  | "view_document"
  | "delete";

export function getCompletionActStatusLabel(status: CompletionActStatus, locale: "ru" | "kk" = "ru"): string {
  return i18n.t(`completionAct.status.${status}`, {
    ns: "LegalApplicationsPage",
    lng: locale,
    fallbackLng: "ru",
  });
}
