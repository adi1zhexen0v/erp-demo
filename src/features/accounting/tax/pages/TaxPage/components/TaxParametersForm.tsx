import { DocumentText1 } from "iconsax-react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Select, DatePicker, Button } from "@/shared/ui";
import type { TaxType } from "@/features/accounting/tax/consts";
import type { Locale } from "@/shared/utils/types";

interface Props {
  taxType: TaxType;
  year: number | null;
  onYearChange: (year: number | null) => void;
  quarter: number | null;
  onQuarterChange: (quarter: number | null) => void;
  endDate: Date | null;
  onEndDateChange: (date: Date | null) => void;
  includeGph: boolean;
  onIncludeGphChange: (include: boolean) => void;
  locale: Locale;
  onGenerate: () => void;
}

function getQuarterOptions(t: ReturnType<typeof useTranslation>["t"]) {
  return [
    { value: 1, label: t("quarters.q1") },
    { value: 2, label: t("quarters.q2") },
    { value: 3, label: t("quarters.q3") },
    { value: 4, label: t("quarters.q4") },
  ];
}

export default function TaxParametersForm({
  taxType,
  year,
  onYearChange,
  quarter,
  onQuarterChange,
  endDate,
  onEndDateChange,
  includeGph: _includeGph,
  onIncludeGphChange: _onIncludeGphChange,
  locale,
  onGenerate,
}: Props) {
  const { t } = useTranslation("TaxPage");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => ({
    value: y,
    label: y.toString(),
  }));

  const isValid = taxType === "cit" ? year !== null : year !== null && quarter !== null;

  const minDate = year !== null ? new Date(year, 0, 1) : undefined;
  const maxDate = year !== null ? new Date(year, 11, 31) : undefined;

  return (
    <div className="p-5 border surface-base-stroke surface-tertiary-fill radius-lg mb-4">
      <div className="mb-4">
        <h3 className="text-body-bold-lg content-base-primary mb-2">
          {taxType === "cit" ? t("forms.cit.title") : t("forms.payroll.title")}
        </h3>
        <p className="text-body-regular-sm content-base-secondary">
          {taxType === "cit" ? t("forms.cit.description") : t("forms.payroll.description")}
        </p>
      </div>

      <div className={cn("grid gap-4", taxType === "payroll" ? "grid-cols-[1fr_1fr_1fr]" : "grid-cols-[1fr_1fr_1fr]")}>
        <Select<number> options={yearOptions} value={year} onChange={onYearChange} placeholder={t("filters.year")} />

        {taxType === "payroll" && (
          <Select<number>
            options={getQuarterOptions(t)}
            value={quarter}
            onChange={onQuarterChange}
            placeholder={t("filters.quarter")}
          />
        )}

        {taxType === "cit" && (
          <DatePicker
            mode="single"
            value={endDate}
            onChange={(date) => {
              if (date && !(date instanceof Date)) return;
              onEndDateChange(date);
            }}
            locale={locale}
            placeholder={t("filters.endDate")}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
        <Button onClick={onGenerate} disabled={!isValid} size="md" className="w-full sm:w-auto flex items-center gap-2">
          <DocumentText1 size={16} color="currentColor" />
          <span>{t("forms.generateButton")}</span>
        </Button>
      </div>
    </div>
  );
}
