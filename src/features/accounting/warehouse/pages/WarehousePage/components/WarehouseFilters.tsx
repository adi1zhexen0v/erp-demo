import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Refresh2 } from "iconsax-react";
import { SearchIcon } from "@/shared/assets/icons";
import { Input, Select, SearchableSelect } from "@/shared/ui";
import type { Locale } from "@/shared/utils/types";
import type { AssetType, ItemStatus } from "../../../types";

export interface AssetTypeOption {
  label: string;
  value: AssetType;
}

export interface StatusOption {
  label: string;
  value: ItemStatus;
}

interface VendorOption {
  id: number;
  name: string;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  assetTypeFilter: AssetType | null;
  onAssetTypeChange: (v: AssetType | null) => void;
  assetTypeOptions: AssetTypeOption[];
  statusFilter: ItemStatus | null;
  onStatusChange: (v: ItemStatus | null) => void;
  statusOptions: StatusOption[];
  vendorFilter: number | null;
  onVendorChange: (v: number | null) => void;
  vendorOptions: VendorOption[];
  hasActiveFilters: boolean;
  onReset: () => void;
  locale: Locale;
  disabled?: boolean;
}

export default function WarehouseFilters({
  search,
  onSearchChange,
  assetTypeFilter,
  onAssetTypeChange,
  assetTypeOptions,
  statusFilter,
  onStatusChange,
  statusOptions,
  vendorFilter,
  onVendorChange,
  vendorOptions,
  hasActiveFilters,
  onReset,
  locale: _locale,
  disabled = false,
}: Props) {
  const { t } = useTranslation("WarehousePage");

  const selectedVendor = useMemo(() => {
    if (vendorFilter === null) return null;
    return vendorOptions.find((v) => v.id === vendorFilter) || null;
  }, [vendorFilter, vendorOptions]);

  return (
    <div
      className={cn(
        "grid p-5 border surface-base-stroke surface-tertiary-fill gap-2 radius-lg mb-4 items-stretch mt-7",
        hasActiveFilters ? "grid-cols-[323fr_240fr_240fr_280fr_174px]" : "grid-cols-[323fr_240fr_240fr_280fr]",
      )}>
      <Input
        placeholder={t("filters.searchPlaceholder")}
        className="rounded-xl!"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={<SearchIcon size={16} />}
        disabled={disabled}
      />

      <Select<AssetType>
        options={assetTypeOptions}
        placeholder={t("filters.category")}
        value={assetTypeFilter}
        onChange={(v) => onAssetTypeChange(v)}
        disabled={disabled}
      />

      <Select<ItemStatus>
        options={statusOptions}
        placeholder={t("filters.status")}
        value={statusFilter}
        onChange={(v) => onStatusChange(v)}
        disabled={disabled}
      />

      <SearchableSelect<VendorOption>
        options={vendorOptions}
        placeholder={t("filters.vendor")}
        value={selectedVendor}
        onChange={(v) => onVendorChange(v?.id ?? null)}
        searchKeys={["name"]}
        displayKey="name"
        disabled={disabled}
      />

      {hasActiveFilters && (
        <button
          className="px-3 h-10 flex justify-center items-center gap-2 content-action-neutral cursor-pointer"
          onClick={onReset}>
          <Refresh2 size={16} color="currentColor" />
          <span className="text-label-medium">{t("filters.reset")}</span>
        </button>
      )}
    </div>
  );
}

