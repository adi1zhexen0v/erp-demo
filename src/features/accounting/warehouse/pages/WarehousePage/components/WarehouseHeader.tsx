import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/shared/ui";

export default function WarehouseHeader() {
  const { t } = useTranslation("WarehousePage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.accounting") }, { label: t("breadcrumbs.warehouse") }]} />

      <div className="flex justify-between items-center mt-2 mb-7">
        <h1 className="text-display-xs content-base-primary">{t("title")}</h1>
      </div>
    </>
  );
}

