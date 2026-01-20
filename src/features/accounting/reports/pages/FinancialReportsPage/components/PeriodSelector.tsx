import { useTranslation } from "react-i18next";
import { Select } from "@/shared/ui";
import { MONTHS_RU } from "@/shared/consts";

interface PeriodSelectorProps {
  year: number;
  month: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i);

export default function PeriodSelector({
  year,
  month,
  onYearChange,
  onMonthChange,
}: PeriodSelectorProps) {
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
    <div className="flex items-center gap-3">
      <div style={{ width: "120px" }}>
        <Select
          value={year}
          onChange={(value) => onYearChange(value as number)}
          options={yearOptions}
          placeholder={t("periodSelector.yearPlaceholder")}
        />
      </div>
      <div style={{ width: "160px" }}>
        <Select
          value={month}
          onChange={(value) => onMonthChange(value as number | null)}
          options={monthOptions}
          placeholder={t("periodSelector.monthPlaceholder")}
        />
      </div>
    </div>
  );
}

