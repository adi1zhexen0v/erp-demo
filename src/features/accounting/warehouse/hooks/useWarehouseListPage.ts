import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import { usePagination } from "@/shared/hooks";
import { toNumber } from "@/shared/utils";
import { useGetWarehouseUnitsQuery, useGetWarehouseItemsQuery } from "../api";
import type { InventoryUnit, AssetType, ItemStatus, TransactionStatus, VendorResponse } from "../types";
import { calculateWarehouseSummary, type WarehouseSummary } from "../utils";
import { useWarehouseSort, toggleSort, type SortKey, type SortConfig } from "./useWarehouseSort";

export interface StatusOption {
  label: string;
  value: ItemStatus;
}

export interface AssetTypeOption {
  label: string;
  value: AssetType;
}

export interface VendorOption {
  id: number;
  name: string;
}

export interface WarehouseGroup {
  groupName: string;
  count: number;
  totalAmount: string;
  units: InventoryUnit[];
}

export interface UseWarehouseListPageReturn {
  data: InventoryUnit[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  assetTypeFilter: AssetType | null;
  setAssetTypeFilter: (value: AssetType | null) => void;
  statusFilter: ItemStatus | null;
  setStatusFilter: (value: ItemStatus | null) => void;
  vendorFilter: number | null;
  setVendorFilter: (value: number | null) => void;
  statusOptions: StatusOption[];
  assetTypeOptions: AssetTypeOption[];
  vendorOptions: VendorOption[];
  activeFilters: boolean;
  locale: Locale;
  filteredItems: InventoryUnit[];
  groupedUnits: WarehouseGroup[];
  getGroupedUnits: (groupName: string) => InventoryUnit[];
  sortConfig: SortConfig<SortKey> | null;
  handleSort: (key: SortKey) => void;
  pagination: ReturnType<typeof usePagination>;
  pageItems: InventoryUnit[];
  handleResetFilters: () => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
  summary: WarehouseSummary;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useWarehouseListPage(): UseWarehouseListPageReturn {
  const { i18n, t } = useTranslation("WarehousePage");
  const locale = i18n.language as Locale;

  const { data: rawData, isLoading: isLoadingUnits, isError } = useGetWarehouseUnitsQuery();
  const { data: itemsData, isLoading: isLoadingItems } = useGetWarehouseItemsQuery();

  const itemStatusMap = useMemo(() => {
    if (!itemsData || !Array.isArray(itemsData)) return new Map<string, TransactionStatus>();
    const map = new Map<string, TransactionStatus>();
    itemsData.forEach((item) => {
      const key = `${item.name}|${item.vendor_name}`;
      map.set(key, item.transaction_status);
    });
    return map;
  }, [itemsData]);

  const data = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return undefined;

    if (isLoadingItems) return undefined;

    if (!itemsData || itemStatusMap.size === 0) {
      return [];
    }

    return rawData.filter((unit) => {
      const vendorName = unit.vendor?.name || "";
      const key = `${unit.item_name}|${vendorName}`;
      const transactionStatus = itemStatusMap.get(key);

      if (transactionStatus === undefined) {
        return false;
      }

      return transactionStatus !== "draft";
    });
  }, [rawData, itemStatusMap, isLoadingItems, itemsData]);

  const isLoading = isLoadingUnits || isLoadingItems;

  const [search, setSearch] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | null>(null);
  const [statusFilter, setStatusFilter] = useState<ItemStatus | null>(null);
  const [vendorFilter, setVendorFilter] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig<SortKey> | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const statusOptions = useMemo<StatusOption[]>(() => {
    return [
      { label: t("status.in_stock"), value: "in_stock" },
      { label: t("status.assigned"), value: "assigned" },
      { label: t("status.written_off"), value: "written_off" },
      { label: t("status.disposed"), value: "disposed" },
    ];
  }, [t]);

  const assetTypeOptions = useMemo<AssetTypeOption[]>(() => {
    return [
      { label: t("assetType.inventory"), value: "inventory" },
      { label: t("assetType.fixed_asset"), value: "fixed_asset" },
    ];
  }, [t]);

  const vendorOptions = useMemo<VendorOption[]>(() => {
    if (!data || !Array.isArray(data)) return [];

    const vendorMap = new Map<number, VendorResponse>();

    data.forEach((unit) => {
      if (unit.vendor && unit.vendor.id) {
        vendorMap.set(unit.vendor.id, unit.vendor);
      }
    });

    return Array.from(vendorMap.values())
      .map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const activeFilters = useMemo(() => {
    return !!search.trim() || !!assetTypeFilter || !!statusFilter || vendorFilter !== null;
  }, [search, assetTypeFilter, statusFilter, vendorFilter]);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const filteredItems = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((unit) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          unit.item_name.toLowerCase().includes(searchLower) ||
          unit.barcode.toLowerCase().includes(searchLower) ||
          unit.serial_number.toLowerCase().includes(searchLower) ||
          (unit.assigned_to_name && unit.assigned_to_name.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      if (assetTypeFilter && unit.asset_type !== assetTypeFilter) {
        return false;
      }

      if (statusFilter && unit.status !== statusFilter) {
        return false;
      }

      if (vendorFilter !== null) {
        if (unit.vendor?.id !== vendorFilter) {
          return false;
        }
      }

      return true;
    });
  }, [data, search, assetTypeFilter, statusFilter, vendorFilter]);

  const groupedUnits = useMemo<WarehouseGroup[]>(() => {
    if (!filteredItems || filteredItems.length === 0) return [];

    const groupMap = new Map<string, InventoryUnit[]>();

    filteredItems.forEach((unit) => {
      const groupKey = unit.assigned_to_name || t("groups.unassigned");
      const existingUnits = groupMap.get(groupKey) || [];
      groupMap.set(groupKey, [...existingUnits, unit]);
    });

    return Array.from(groupMap.entries())
      .map(([groupName, units]) => {
        const totalAmount = units.reduce((sum, unit) => {
          const cost = toNumber(unit.unit_cost);
          return sum + cost;
        }, 0);

        return {
          groupName,
          count: units.length,
          totalAmount: totalAmount.toFixed(2),
          units,
        };
      })
      .sort((a, b) => {
        const unassignedLabel = t("groups.unassigned");
        if (a.groupName === unassignedLabel) return -1;
        if (b.groupName === unassignedLabel) return 1;
        return a.groupName.localeCompare(b.groupName);
      });
  }, [filteredItems, t]);

  function getGroupedUnits(groupName: string): InventoryUnit[] {
    const group = groupedUnits.find((g) => g.groupName === groupName);
    return group?.units || [];
  }

  const sortedItems = useWarehouseSort(filteredItems, sortConfig);
  const pagination = usePagination(sortedItems.length, 10, [
    search,
    assetTypeFilter,
    statusFilter,
    vendorFilter,
    sortConfig,
  ]);
  const pageItems = sortedItems.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setAssetTypeFilter(null);
    setStatusFilter(null);
    setVendorFilter(null);
    setSortConfig(null);
  }

  const summary = useMemo(() => {
    return calculateWarehouseSummary(filteredItems);
  }, [filteredItems]);

  return {
    data,
    isLoading,
    isError,
    search,
    setSearch,
    assetTypeFilter,
    setAssetTypeFilter,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    statusOptions,
    assetTypeOptions,
    activeFilters,
    locale,
    filteredItems,
    groupedUnits,
    getGroupedUnits,
    sortConfig,
    handleSort,
    pagination,
    pageItems,
    handleResetFilters,
    viewMode,
    setViewMode,
    vendorOptions,
    summary,
    t,
  };
}

