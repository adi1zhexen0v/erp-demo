import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import type { Locale } from "@/shared/utils/types";
import { useGetHolidaysQuery, type HolidayApiResponse } from "@/shared/api/holidays";
import { getHolidayEnglishName } from "@/shared/consts/holidays";

interface HolidaysLegendProps {
  month: number;
}

export default function HolidaysLegend({ month }: HolidaysLegendProps) {
  const { t } = useTranslation("TimesheetsPage");
  const locale = (i18n.language as Locale) || "ru";

  const { data: holidays = [], isLoading } = useGetHolidaysQuery();

  const monthHolidays = useMemo(() => {
    return holidays.filter((holiday) => holiday.month === month);
  }, [holidays, month]);

  function getName(holiday: HolidayApiResponse): string {
    if (locale === "ru") return holiday.name_ru;
    if (locale === "kk") return holiday.name_kk;
    const englishName = getHolidayEnglishName(holiday.month, holiday.day);
    return englishName || holiday.name_ru;
  }

  if (isLoading) {
    return (
      <div className="mb-7">
        <p className="text-label-md content-base-primary mb-3">{t("detail.holidays")}</p>
        <div className="flex flex-wrap gap-5 mb-5">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2 justify-start animate-pulse">
              <div className="w-8 aspect-square rounded bg-grey-200 dark:bg-grey-700" />
              <div className="h-4 w-24 rounded bg-grey-200 dark:bg-grey-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (monthHolidays.length === 0) {
    return null;
  }

  return (
    <div className="mb-7">
      <p className="text-label-md content-base-primary mb-3">{t("detail.holidays")}</p>
      <div className="flex flex-wrap gap-5 mb-5">
        {monthHolidays.map((holiday) => (
          <div key={holiday.id} className="flex items-center gap-2 justify-start">
            <div className="w-8 aspect-square flex items-center justify-center content-action-negative border border-negative-500 radius-xs text-body-bold-sm">
              {holiday.day}
            </div>
            <p className="text-body-regular-sm content-base-primary">{getName(holiday)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
