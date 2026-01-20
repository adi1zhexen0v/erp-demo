import { useTranslation } from "react-i18next";
import { DocumentText } from "iconsax-react";
import type { TaxType, CITFormCode, PayrollFormCode } from "@/features/accounting/tax/consts";
import { CIT_FORM_ICONS, PAYROLL_FORM_ICONS } from "@/features/accounting/tax/consts";

interface Props {
  taxType: TaxType;
  activeForm: string;
  year: number | null;
  quarter: number | null;
}

export default function DeclarationHeader({ taxType, activeForm, year, quarter }: Props) {
  const { t } = useTranslation("TaxPage");

  const FormIconComponent =
    (taxType === "cit"
      ? CIT_FORM_ICONS[activeForm as CITFormCode]
      : PAYROLL_FORM_ICONS[activeForm as PayrollFormCode]) || DocumentText;

  const formCode = activeForm;

  let title = `${taxType === "cit" ? t("forms.cit.title") : t("forms.payroll.title")} (${t("common.form")} ${formCode})`;

  if (taxType === "cit") {
    title += ` ${t("common.for")} ${year} ${t("common.year")}`;
  } else {
    title += ` ${t("common.for")} ${year} ${t("common.year")}`;
    if (quarter) {
      title += `, ${quarter} ${t("common.quarter")}`;
    }
  }

  if (!year) return null;

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-10 aspect-square radius-xs surface-component-fill flex items-center justify-center">
        <span className="content-action-neutral">
          <FormIconComponent size={20} color="currentColor" />
        </span>
      </div>
      <h1 className="text-body-bold-lg content-base-primary">{title}</h1>
    </div>
  );
}
