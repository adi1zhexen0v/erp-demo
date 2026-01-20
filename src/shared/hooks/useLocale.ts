import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";

export function useLocale(): Locale {
  const { i18n } = useTranslation();
  const language = i18n.language as Locale;
  
  if (language === "ru" || language === "kk" || language === "en") {
    return language;
  }
  
  return "ru";
}

