import { useTranslation } from "react-i18next";
import { Refresh2 } from "iconsax-react";
import { Button, Select } from "@/shared/ui";
import { MONTHS_RU } from "@/shared/consts";

interface HeaderSectionProps {
  year: number;
  month: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
  hasPeriodChanged: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i);

export default function HeaderSection({
  year,
  month,
  onYearChange,
  onMonthChange,
  hasPeriodChanged,
  onRefresh,
  isLoading = false,
}: HeaderSectionProps) {
  const { t } = useTranslation("ReportsPage");

  const yearOptions = YEARS.map((y) => ({
    value: y,
    label: y.toString(),
  }));

  const monthOptions = [
    { value: null, label: t("periodSelector.allYear") },
    ...MONTHS_RU.map((name, index) => ({
      value: index + 1,
      label: name,
    })),
  ];

  return (
    <div className="p-5 border surface-base-stroke surface-tertiary-fill radius-lg mb-6">
      <div className="mb-4">
        <h3 className="text-body-bold-lg content-base-primary mb-2">
          {t("periodSelector.title")}
        </h3>
        <p className="text-body-regular-sm content-base-secondary">
          {t("periodSelector.description")}
        </p>
      </div>
      <div className="grid gap-4 grid-cols-[1fr_1fr_1fr]">
        <Select
          value={year}
          onChange={(value) => onYearChange(value as number)}
          options={yearOptions}
          placeholder={t("periodSelector.yearPlaceholder")}
        />
        <Select
          value={month}
          onChange={(value) => onMonthChange(value as number | null)}
          options={monthOptions}
          placeholder={t("periodSelector.monthPlaceholder")}
        />
        <Button
          variant="primary"
          size="md"
          onClick={onRefresh}
          disabled={!hasPeriodChanged || isLoading}
          className="w-full sm:w-auto flex items-center gap-2">
          <Refresh2 size={16} color="currentColor" />
          <span>{t("actions.refresh")}</span>
        </Button>
      </div>
    </div>
  );
}
