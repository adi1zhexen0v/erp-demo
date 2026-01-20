import { type Locale } from "@/shared/utils/types";

export const CALENDAR_LOCALE: Record<
  Locale,
  {
    months: string[];
    monthsShort: string[];
    weekdays: string[];
    done: string;
    hour: string;
    minute: string;
    selectTime: string;
  }
> = {
  ru: {
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    done: "Готово",
    hour: "час",
    minute: "мин",
    selectTime: "Выберите время",
  },

  kk: {
    months: [
      "Қаңтар",
      "Ақпан",
      "Наурыз",
      "Сәуір",
      "Мамыр",
      "Маусым",
      "Шілде",
      "Тамыз",
      "Қыркүйек",
      "Қазан",
      "Қараша",
      "Желтоқсан",
    ],
    monthsShort: ["Қаң", "Ақп", "Нау", "Сәу", "Мам", "Мау", "Шіл", "Там", "Қыр", "Қаз", "Қар", "Жел"],
    weekdays: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"],
    done: "Дайын",
    hour: "сағат",
    minute: "мин",
    selectTime: "Уақытты таңдаңыз",
  },

  en: {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    done: "Done",
    hour: "hour",
    minute: "min",
    selectTime: "Select time",
  },
};
