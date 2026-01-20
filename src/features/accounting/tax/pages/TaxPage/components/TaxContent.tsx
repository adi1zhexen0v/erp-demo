import { useTranslation } from "react-i18next";
import type { UseTaxPageReturn } from "@/features/accounting/tax/hooks";
import Form10000 from "@/features/accounting/tax/forms/CIT/Form10000";
import Form10001 from "@/features/accounting/tax/forms/CIT/Form10001";
import Form10002 from "@/features/accounting/tax/forms/CIT/Form10002";
import Form10007 from "@/features/accounting/tax/forms/CIT/Form10007";
import Form20000 from "@/features/accounting/tax/forms/Payroll/Form20000";
import Form20001 from "@/features/accounting/tax/forms/Payroll/Form20001";
import Form20005 from "@/features/accounting/tax/forms/Payroll/Form20005";
import TaxFormSkeleton from "./TaxFormSkeleton";

interface Props {
  taxType: UseTaxPageReturn["taxType"];
  activeForm: string;
  form100Data: UseTaxPageReturn["form100Data"];
  form100Loading: boolean;
  form100Error: boolean;
  form10001Data: UseTaxPageReturn["form10001Data"];
  form10001Loading: boolean;
  form10001Error: boolean;
  form10002Data: UseTaxPageReturn["form10002Data"];
  form10002Loading: boolean;
  form10002Error: boolean;
  form10007Data: UseTaxPageReturn["form10007Data"];
  form10007Loading: boolean;
  form10007Error: boolean;
  form200Data: UseTaxPageReturn["form200Data"];
  form200Loading: boolean;
  form200Error: boolean;
  form20001Data: UseTaxPageReturn["form20001Data"];
  form20001Loading: boolean;
  form20001Error: boolean;
  form20005Data: UseTaxPageReturn["form20005Data"];
  form20005Loading: boolean;
  form20005Error: boolean;
}

export default function TaxContent({
  taxType,
  activeForm,
  form100Data,
  form100Loading,
  form100Error,
  form10001Data,
  form10001Loading,
  form10001Error,
  form10002Data,
  form10002Loading,
  form10002Error,
  form10007Data,
  form10007Loading,
  form10007Error,
  form200Data,
  form200Loading,
  form200Error,
  form20001Data,
  form20001Loading,
  form20001Error,
  form20005Data,
  form20005Loading,
  form20005Error,
}: Props) {
  const { t } = useTranslation("TaxPage");

  if (taxType === "cit") {
    if (activeForm === "100.00") {
      if (form100Loading) return <TaxFormSkeleton />;
      if (form100Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form100Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form10000 data={form100Data} />;
    }

    if (activeForm === "100.01") {
      if (form10001Loading) return <TaxFormSkeleton />;
      if (form10001Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form10001Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form10001 data={form10001Data} />;
    }

    if (activeForm === "100.02") {
      if (form10002Loading) return <TaxFormSkeleton />;
      if (form10002Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form10002Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form10002 data={form10002Data} />;
    }

    if (activeForm === "100.07") {
      if (form10007Loading) return <TaxFormSkeleton />;
      if (form10007Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form10007Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form10007 data={form10007Data} />;
    }
  } else {
    if (activeForm === "200.00") {
      if (form200Loading) return <TaxFormSkeleton />;
      if (form200Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form200Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form20000 data={form200Data} />;
    }

    if (activeForm === "200.01") {
      if (form20001Loading) return <TaxFormSkeleton />;
      if (form20001Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form20001Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form20001 data={form20001Data} />;
    }

    if (activeForm === "200.05") {
      if (form20005Loading) return <TaxFormSkeleton />;
      if (form20005Error) return <p className="text-body-regular-md text-negative-500">{t("messages.error")}</p>;
      if (!form20005Data) return <p className="text-body-regular-md content-action-neutral">{t("messages.noData")}</p>;
      return <Form20005 data={form20005Data} />;
    }
  }

  return null;
}

