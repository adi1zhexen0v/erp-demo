import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalWrapper, Checkbox, Button } from "@/shared/ui";
import type { CheckboxState } from "@/shared/ui";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import type { GPHPayment, ConstantsUsed } from "@/features/accounting/payroll";
import { formatPercentageFromRate } from "@/features/accounting/shared";

interface Props {
  payment: GPHPayment;
  constants_used?: ConstantsUsed;
  onClose: () => void;
  onConfirm: (applyMrpDeduction: boolean) => Promise<void>;
  isLoading?: boolean;
}

export default function GPHApproveModal({ payment, constants_used, onClose, onConfirm, isLoading = false }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  const mrp = constants_used?.mrp ?? 4325;
  const mrpDeductionCount = constants_used?.mrp_deduction_count ?? 14;
  const mrpDeduction = mrpDeductionCount * mrp;
  const ipnRate = constants_used?.ipn_rate ?? 0.1;

  const currentApplyMrp = payment.apply_mrp_deduction ?? payment.calculation_snapshot?.input?.apply_mrp_deduction ?? false;
  const [applyMrpDeduction, setApplyMrpDeduction] = useState<CheckboxState>(currentApplyMrp ? "checked" : "unchecked");

  const grossAmount = toNumber(payment.gross_amount);
  const opv = toNumber(payment.opv);
  const vosms = toNumber(payment.vosms);

  const willApplyMrp = applyMrpDeduction === "checked";
  const ipnBase = grossAmount - opv - vosms - (willApplyMrp ? mrpDeduction : 0);
  const estimatedIpn = Math.max(0, ipnBase * ipnRate);
  const estimatedTotalWithheld = opv + vosms + estimatedIpn;
  const estimatedNet = grossAmount - estimatedTotalWithheld;

  async function handleConfirm() {
    if (isLoading) return;
    const newValue = applyMrpDeduction === "checked";
    await onConfirm(newValue);
  }

  return (
    <ModalWrapper onClose={onClose} width="w-md">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-body-bold-lg content-base-primary">{t("confirm.gphApproveTitle")}</h3>
          <p className="text-body-regular-sm content-base-secondary">{t("confirm.gphApproveText")}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-body-regular-sm content-base-primary">
            {t("tabs.gph.contractor")} {payment.contractor_name}
          </p>
          <p className="text-body-regular-sm content-base-secondary">
            {t("detail.gphPayment.completionAct")}: {payment.completion_act.display_number}
          </p>
          <p className="text-body-bold-md content-base-primary">
            {t("tabs.gph.grossAmount")}: {formatMoneyKzt(grossAmount, locale)}
          </p>
        </div>

        <div className="p-4 radius-sm border surface-base-stroke flex flex-col gap-3">
          <Checkbox
            state={applyMrpDeduction}
            onChange={() => setApplyMrpDeduction(applyMrpDeduction === "checked" ? "unchecked" : "checked")}
            label={t("tabs.gph.mrpDeduction")}
          />
          <p className="text-label-xs content-action-neutral pl-6">{t("tabs.gph.ipnInfo")}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-label-sm content-base-primary">{t("tabs.gph.preliminaryCalculation")}</p>
          <div className="flex flex-col gap-2 pt-2 border-t surface-base-stroke">
            <div className="flex justify-between items-center">
              <span className="text-label-xs content-action-neutral">{t("tabs.accrual.opvTitle")}</span>
              <span className="text-body-bold-sm content-base-primary">{formatMoneyKzt(opv, locale)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-label-xs content-action-neutral">{t("tabs.accrual.vosmsTitle")}</span>
              <span className="text-body-bold-sm content-base-primary">{formatMoneyKzt(vosms, locale)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-label-xs content-action-neutral">
                {t("tabs.accrual.ipnTitle")} {formatPercentageFromRate(ipnRate)}
                {willApplyMrp && <span className="content-action-positive ml-1">({t("tabs.gph.withDeduction")})</span>}
              </span>
              <span className="text-body-bold-sm content-base-primary">{formatMoneyKzt(estimatedIpn, locale)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t surface-base-stroke">
              <span className="text-body-bold-sm content-base-primary">{t("tabs.accrual.netPay")}</span>
              <span className="text-body-bold-md content-action-positive">{formatMoneyKzt(estimatedNet, locale)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="md" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? t("prompt_form.submitting") : t("confirm.gphApproveConfirm")}
          </Button>
          <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            {t("confirm.cancel")}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
