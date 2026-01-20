import type { PurchaseCategory } from "./types";

export const CATEGORY_LABELS: Record<PurchaseCategory, { ru: string; en: string; kk: string }> = {
  "1330": { ru: "ТМЗ", en: "Inventory", kk: "ТМЗ" },
  "2410": { ru: "ОС", en: "Fixed Assets", kk: "Негізгі құралдар" },
  "2730": { ru: "НМА", en: "Intangible Assets", kk: "НМА" },
  "7210": { ru: "Услуги", en: "Services", kk: "Қызметтер" },
};

export const DEFAULT_INITIAL_CASH = 1000000;


