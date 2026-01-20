import { Refresh2 } from "iconsax-react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Select, DatePicker, Checkbox } from "@/shared/ui";
import type { TaxType } from "@/features/accounting/tax/consts";
import type { Locale } from "@/shared/utils/types";

interface Props {
  taxType: TaxType;
  onTaxTypeChange: (type: TaxType) => void;
  year: number | null;
  onYearChange: (year: number | null) => void;
  quarter: number | null;
  onQuarterChange: (quarter: number | null) => void;
  endDate: Date | null;
  onEndDateChange: (date: Date | null) => void;
  includeGph: boolean;
  onIncludeGphChange: (include: boolean) => void;
  locale: Locale;
  hasActiveFilters: boolean;
  onReset: () => void;
}

function getQuarterOptions(t: ReturnType<typeof useTranslation>["t"]) {
  return [
    { value: 1, label: `1 ${t("common.quarter")}` },
    { value: 2, label: `2 ${t("common.quarter")}` },
    { value: 3, label: `3 ${t("common.quarter")}` },
    { value: 4, label: `4 ${t("common.quarter")}` },
  ];
}

export default function TaxFilters({
  taxType,
  onTaxTypeChange,
  year,
  onYearChange,
  quarter,
  onQuarterChange,
  endDate,
  onEndDateChange,
  includeGph,
  onIncludeGphChange,
  locale,
  hasActiveFilters,
  onReset,
}: Props) {
  const { t } = useTranslation("TaxPage");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => ({
    value: y,
    label: y.toString(),
  }));

  const taxTypeOptions: Array<{ value: TaxType; label: string }> = [
    { value: "cit", label: t("taxTypes.cit") },
    { value: "payroll", label: t("taxTypes.payroll") },
  ];

  return (
    <div
      className={cn(
        "grid p-5 border surface-base-stroke surface-tertiary-fill gap-2 radius-lg mb-4",
        hasActiveFilters
          ? taxType === "payroll"
            ? "grid-cols-[1fr_1fr_1fr_1fr_174px]"
            : "grid-cols-[1fr_1fr_1fr_174px]"
          : taxType === "payroll"
            ? "grid-cols-[1fr_1fr_1fr_1fr]"
            : "grid-cols-[1fr_1fr_1fr]",
      )}>
      <Select<TaxType>
        options={taxTypeOptions}
        value={taxType}
        onChange={(val) => val !== null && onTaxTypeChange(val)}
        placeholder={t("filters.taxType")}
      />

      <Select<number>
        options={yearOptions}
        value={year}
        onChange={onYearChange}
        placeholder={t("filters.year")}
      />

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
        />
      )}

      {taxType === "payroll" && (
        <div className="flex items-center gap-2">
          <Checkbox
            state={includeGph ? "checked" : "unchecked"}
            onChange={() => onIncludeGphChange(!includeGph)}
          />
          <span className="text-body-regular-sm content-base-primary">{t("filters.includeGph")}</span>
        </div>
      )}

      {hasActiveFilters && (
        <button
          className="px-3 h-10 flex justify-center items-center gap-2 content-action-neutral cursor-pointer"
          onClick={onReset}>
          <Refresh2 size={16} />
          <span className="text-label-medium">{t("filters.reset")}</span>
        </button>
      )}
    </div>
  );
}

