// @ts-expect-error - number-to-words-kz не имеет типов
import NumberToWordsKz from "number-to-words-kz";
import { convert as convertRu } from "number-to-words-ru";

export function formatPrice(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return String(value);
  }

  const roundedNum = Math.round(num);
  return roundedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function removeTrailingZeros(value: string): string {
  if (!value) return value;
  return value.replace(/,00$|\.00$/, "");
}

export function numberToText(value: number | string, locale: "ru" | "kk" = "ru"): string {
  const num = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(num) || num <= 0) {
    return "";
  }

  try {
    if (locale === "ru") {
      const result = convertRu(num, {
        currency: "number",
        showNumberParts: {
          integer: true,
          fractional: false,
        },
        convertNumberToWords: {
          integer: true,
          fractional: false,
        },
      });

      if (!result) {
        return "";
      }

      return result.split(" ").slice(0, -1).join(" ").toLowerCase().trim();
    }

    if (locale === "kk") {
      const result = NumberToWordsKz(num);
      if (!result) {
        return "";
      }
      return result.trim();
    }

    return "";
  } catch {
    return "";
  }
}

