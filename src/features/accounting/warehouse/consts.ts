import type { AssetType, ItemStatus, FixedAssetGroup } from "./types";

export const ASSET_TYPE_LABELS: Record<AssetType, { ru: string; en: string; kk: string }> = {
  inventory: { ru: "Товары", en: "Goods", kk: "Тауарлар" },
  fixed_asset: { ru: "Основные средства", en: "Fixed Assets", kk: "Негізгі құралдар" },
  intangible: { ru: "Нематериальные активы", en: "Intangible Assets", kk: "Мәдени емес активтер" },
};

export const STATUS_LABELS: Record<ItemStatus, { ru: string; en: string; kk: string }> = {
  in_stock: { ru: "На складе", en: "In Stock", kk: "Қоймада" },
  assigned: { ru: "Выдан сотруднику", en: "Assigned", kk: "Қызметкерге берілген" },
  written_off: { ru: "Списан", en: "Written Off", kk: "Есептен шығарылған" },
  disposed: { ru: "Выбыл", en: "Disposed", kk: "Шыққан" },
};

export const FIXED_ASSET_GROUP_LABELS: Record<FixedAssetGroup, { ru: string; en: string; kk: string }> = {
  group1: { ru: "Здания, сооружения (10%)", en: "Buildings (10%)", kk: "Ғимараттар (10%)" },
  group2: { ru: "Машины, оборудование (25%)", en: "Machinery (25%)", kk: "Машиналар (25%)" },
  group3: { ru: "Компьютеры, оргтехника (40%)", en: "Computers (40%)", kk: "Компьютерлер (40%)" },
  group4: { ru: "Транспорт (15%)", en: "Transport (15%)", kk: "Көлік (15%)" },
  other: { ru: "Прочие (15%)", en: "Other (15%)", kk: "Басқа (15%)" },
};

export const FIXED_ASSET_GROUP_DEFAULTS: Record<FixedAssetGroup, { rate: number; months: number }> = {
  group1: { rate: 0.10, months: 120 },
  group2: { rate: 0.25, months: 48 },
  group3: { rate: 0.40, months: 30 },
  group4: { rate: 0.15, months: 80 },
  other: { rate: 0.15, months: 80 },
};


