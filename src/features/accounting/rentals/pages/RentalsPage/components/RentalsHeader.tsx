import { useTranslation } from "react-i18next";
import { Add } from "iconsax-react";
import { Breadcrumbs, Button } from "@/shared/ui";

interface Props {
  onCreateClick?: () => void;
  showCreateButton?: boolean;
}

export default function RentalsHeader({ onCreateClick, showCreateButton = false }: Props) {
  const { t } = useTranslation("RentalsPage");

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumbs.accounting") }, { label: t("breadcrumbs.rentals") }]} />

      <div className="flex justify-between items-center mt-2 mb-7">
        <h1 className="text-display-xs content-base-primary">{t("title")}</h1>

        {showCreateButton && onCreateClick && (
          <div className="flex justify-end gap-2">
            <Button variant="primary" className="h-10 px-3" onClick={onCreateClick}>
              <Add size={16} color="currentColor" />
              {t("header.createPayment")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

