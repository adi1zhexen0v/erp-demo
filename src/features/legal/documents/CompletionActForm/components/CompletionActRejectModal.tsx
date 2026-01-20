import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Button, Input } from "@/shared/ui";

interface Props {
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export default function CompletionActRejectModal({ onClose, onConfirm, isLoading }: Props) {
  const { t } = useTranslation("LegalApplicationsPage");
  const [reason, setReason] = useState("");

  async function handleConfirm() {
    await onConfirm(reason);
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h4 className="text-display-2xs content-base-primary">{t("completionAct.rejectTitle")}</h4>
        </div>

        <div>
          <Input
            isTextarea
            placeholder={t("completionAct.fields.rejectionReasonPlaceholder")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
              {t("modals.cancel")}
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? t("completionAct.actions.rejecting") : t("completionAct.actions.reject")}
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
