import i18n from "@/app/i18n";
import type { LocalizedString } from "../types/api";

export function getLocalizedText(text: LocalizedString | string, locale?: string): string {
  if (typeof text === "string") {
    return text;
  }

  const currentLocale = locale || i18n.language || "ru";
  const lang = currentLocale as keyof LocalizedString;

  return text[lang] || text.ru || text.en || text.kk || "";
}
