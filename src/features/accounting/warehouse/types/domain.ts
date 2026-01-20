export type AssetType = "inventory" | "fixed_asset" | "intangible";

export type ItemStatus = "in_stock" | "assigned" | "written_off" | "disposed";

export type TransactionStatus = "draft" | "approved" | "paid";

export type FixedAssetGroup = "group1" | "group2" | "group3" | "group4" | "other";

export type MovementType =
  | "receipt"
  | "assignment"
  | "return"
  | "depreciation"
  | "write_off"
  | "adjustment"
  | "disposal";


