import { useTranslation } from "react-i18next";
import React from "react";
import type { Icon } from "iconsax-react";
import { Tabs } from "@/shared/ui";
import type { TaxType } from "@/features/accounting/tax/consts";
import { CIT_FORMS, PAYROLL_FORMS, CIT_FORM_ICONS, PAYROLL_FORM_ICONS } from "@/features/accounting/tax/consts";

interface Props {
  taxType: TaxType;
  activeForm: string;
  onFormChange: (form: string) => void;
}

export default function TaxTabs({ taxType, activeForm, onFormChange }: Props) {
  const { t } = useTranslation("TaxPage");

  const forms = taxType === "cit" ? CIT_FORMS : PAYROLL_FORMS;
  const icons = taxType === "cit" ? CIT_FORM_ICONS : PAYROLL_FORM_ICONS;

  const tabItems = forms.map((form) => {
    const IconComponent = icons[form as keyof typeof icons] as Icon | undefined;
    return {
      id: form,
      label: t(`tabs.${taxType}.${form}`),
      icon: IconComponent ? (
        <span className="content-action-brand">
          {React.createElement(IconComponent as React.ComponentType<{ size?: number; color?: string }>, {
            size: 20,
            color: "currentColor",
          })}
        </span>
      ) : null,
    };
  });

  return <Tabs items={tabItems} activeId={activeForm} onChange={onFormChange} />;
}

