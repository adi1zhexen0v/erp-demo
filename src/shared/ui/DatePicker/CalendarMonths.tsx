import { type Locale } from "@/shared/utils/types";
import { CALENDAR_LOCALE } from "./locale";

interface Props {
  currentMonth: number;
  currentYear: number;
  onSelect: (month: number) => void;
  locale: Locale;
}

export default function CalendarMonths({ currentMonth, currentYear: _currentYear, onSelect, locale }: Props) {
  const t = CALENDAR_LOCALE[locale];
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month) => (
        <button
          type="button"
          key={month}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(month);
          }}
          className={`
            w-20 h-9 flex items-center justify-center radius-xs text-body-regular-sm
            text-grey-950 dark:text-grey-200 cursor-pointer
            ${month === currentMonth ? "bg-primary-500 text-white" : "hover:bg-black/5"}
          `}>
          {t.monthsShort[month]}
        </button>
      ))}
    </div>
  );
}

