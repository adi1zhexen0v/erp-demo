import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";

export default function EmployeesHeader() {
  const { t } = useTranslation("EmployeesPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.hr") }, { label: t("breadcrumbs.employees") }]} />
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-display-xs content-base-primary">{t("header.title")}</h1>

        <div className="flex justify-end gap-2 pr-0.5"></div>
      </div>
    </>
  );
}
