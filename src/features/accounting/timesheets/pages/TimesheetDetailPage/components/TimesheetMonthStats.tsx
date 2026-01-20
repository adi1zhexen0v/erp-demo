import { useTranslation } from "react-i18next";
import { Calendar2, CalendarTick, Briefcase, Clock } from "iconsax-react";

interface Props {
  calendarDays: number;
  holidayDays: number;
  workDays: number;
  workHours: number;
}

export default function TimesheetMonthStats({ calendarDays, holidayDays, workDays, workHours }: Props) {
  const { t } = useTranslation("TimesheetsPage");

  const cards = [
    {
      label: t("detail.calendarDays"),
      value: calendarDays,
      icon: Calendar2,
    },
    {
      label: t("detail.holidayDays"),
      value: holidayDays,
      icon: CalendarTick,
    },
    {
      label: t("detail.workDays"),
      value: workDays,
      icon: Briefcase,
    },
    {
      label: t("detail.workHours40h"),
      value: workHours,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-7">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="p-5 radius-lg border surface-base-stroke flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <p className="text-label-sm content-base-primary">{card.label}</p>
              <div className="w-8 aspect-square flex justify-center items-center surface-component-fill content-action-neutral radius-xs">
                <Icon size={16} color="currentColor" />
              </div>
            </div>
            <h6 className="text-display-sm content-base-primary">{card.value}</h6>
          </div>
        );
      })}
    </div>
  );
}
