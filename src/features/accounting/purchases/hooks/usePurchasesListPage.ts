import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import type { DateRange } from "@/shared/utils";
import { usePagination } from "@/shared/hooks";
import { matchesDateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay } from "@/shared/utils";
import { useGetPurchasesItemsQuery } from "../api";
import type { InventoryItemListItem } from "../../warehouse/types";
import type { PurchaseStatus, PurchaseCategory, GroupedPurchase } from "../types";
import { assetTypeToCategory } from "../types/api";
import { groupPurchasesByInvoiceNumber } from "../utils";
import { usePurchasesSort, toggleSort, type SortKey, type SortConfig } from "./usePurchasesSort";

export interface StatusOption {
  label: string;
  value: PurchaseStatus;
}

export interface CategoryOption {
  label: string;
  value: PurchaseCategory;
}

export interface UsePurchasesListPageReturn {
  data: InventoryItemListItem[] | undefined;
  groupedData: GroupedPurchase[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  statusFilter: PurchaseStatus | null;
  setStatusFilter: (value: PurchaseStatus | null) => void;
  categoryFilter: PurchaseCategory | null;
  setCategoryFilter: (value: PurchaseCategory | null) => void;
  statusOptions: StatusOption[];
  categoryOptions: CategoryOption[];
  activeFilters: boolean;
  locale: Locale;
  filteredPurchases: GroupedPurchase[];
  sortConfig: SortConfig<SortKey> | null;
  handleSort: (key: SortKey) => void;
  pagination: ReturnType<typeof usePagination>;
  pagePurchases: GroupedPurchase[];
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function usePurchasesListPage(): UsePurchasesListPageReturn {
  const { i18n, t } = useTranslation("PurchasesPage");
  const locale = i18n.language as Locale;

  const { data, isLoading, isError } = useGetPurchasesItemsQuery();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<PurchaseCategory | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig<SortKey> | null>(null);

  const statusOptions = useMemo<StatusOption[]>(() => {
    return [
      { label: t("status.draft"), value: "draft" },
      { label: t("status.approved"), value: "approved" },
      { label: t("status.paid"), value: "paid" },
    ];
  }, [t]);

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    return [
      { label: t("category.1330"), value: "1330" },
      { label: t("category.2410"), value: "2410" },
      { label: t("category.2730"), value: "2730" },
      { label: t("category.7210"), value: "7210" },
    ];
  }, [t]);

  const activeFilters = useMemo(() => {
    return !!search.trim() || !!dateRange.start || !!dateRange.end || !!statusFilter || !!categoryFilter;
  }, [search, dateRange, statusFilter, categoryFilter]);

  function handleSort(key: SortKey) {
    setSortConfig((prev) => toggleSort(prev, key));
  }

  const groupedData = useMemo(() => {
    if (!data) return [];
    return groupPurchasesByInvoiceNumber(data);
  }, [data]);

  const filteredPurchases = useMemo(() => {
    return groupedData.filter((group: GroupedPurchase) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          group.vendor_name.toLowerCase().includes(searchLower) ||
          (group.invoice_number && group.invoice_number.toLowerCase().includes(searchLower)) ||
          (group.vendor_bin && group.vendor_bin.includes(search)) ||
          group.items.some(
            (item: InventoryItemListItem) =>
              item.vendor_name.toLowerCase().includes(searchLower) ||
              (item.invoice_number && item.invoice_number.toLowerCase().includes(searchLower)),
          );

        if (!matchesSearch) return false;
      }

      if (statusFilter && group.status !== statusFilter) {
        return false;
      }

      if (categoryFilter) {
        if (group.category === "mixed") {
          const hasCategory = group.items.some(
            (item: InventoryItemListItem) => assetTypeToCategory(item.asset_type) === categoryFilter,
          );
          if (!hasCategory) return false;
        } else if (group.category !== categoryFilter) {
          return false;
        }
      }

      if (dateRange.start || dateRange.end) {
        const purchaseDate = group.invoice_date ? new Date(group.invoice_date) : null;
        if (!purchaseDate) return false;

        const normalizedDate = normalizeDateToStartOfDay(purchaseDate);
        const matches = matchesDateRange(normalizedDate, dateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay);
        if (!matches) return false;
      }

      return true;
    });
  }, [groupedData, search, statusFilter, categoryFilter, dateRange]);

  const sortedPurchases = usePurchasesSort(filteredPurchases, sortConfig);
  const pagination = usePagination(sortedPurchases.length, 10, [
    search,
    statusFilter,
    categoryFilter,
    dateRange,
    sortConfig,
  ]);
  const pagePurchases = sortedPurchases.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setStatusFilter(null);
    setCategoryFilter(null);
    setSortConfig(null);
  }

  return {
    data,
    groupedData,
    isLoading,
    isError,
    search,
    setSearch,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    statusOptions,
    categoryOptions,
    activeFilters,
    locale,
    filteredPurchases,
    sortConfig,
    handleSort,
    pagination,
    pagePurchases,
    handleResetFilters,
    t,
  };
}

