import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import type { DateRange } from "@/shared/utils";
import { usePagination } from "@/shared/hooks";
import { matchesDateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay } from "@/shared/utils";
import { useGetRentalPaymentsQuery } from "../api";
import type { RentalPaymentStatus, RentalType, RentalPaymentListItem } from "../types";
import { useRentalPaymentsSort, toggleRentalPaymentSort, type RentalPaymentSortKey, type RentalPaymentSortConfig } from "./useRentalsSort";

export interface StatusOption {
  label: string;
  value: RentalPaymentStatus;
}

export interface RentalTypeOption {
  label: string;
  value: RentalType;
}

export interface UseRentalPaymentsListPageReturn {
  data: RentalPaymentListItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
  statusFilter: RentalPaymentStatus | null;
  setStatusFilter: (value: RentalPaymentStatus | null) => void;
  rentalTypeFilter: RentalType | null;
  setRentalTypeFilter: (value: RentalType | null) => void;
  statusOptions: StatusOption[];
  rentalTypeOptions: RentalTypeOption[];
  activeFilters: boolean;
  locale: Locale;
  filteredPayments: RentalPaymentListItem[];
  sortConfig: RentalPaymentSortConfig | null;
  handleSort: (key: RentalPaymentSortKey) => void;
  pagination: ReturnType<typeof usePagination>;
  pagePayments: RentalPaymentListItem[];
  handleResetFilters: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useRentalPaymentsListPage(): UseRentalPaymentsListPageReturn {
  const { i18n, t } = useTranslation("RentalsPage");
  const locale = i18n.language as Locale;

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [statusFilter, setStatusFilter] = useState<RentalPaymentStatus | null>(null);
  const [rentalTypeFilter, setRentalTypeFilter] = useState<RentalType | null>(null);
  const [sortConfig, setSortConfig] = useState<RentalPaymentSortConfig | null>(null);

  const queryParams = useMemo(() => {
    const params: {
      rental_type?: RentalType;
      status?: RentalPaymentStatus;
      start_date?: string;
      end_date?: string;
    } = {};

    if (rentalTypeFilter) {
      params.rental_type = rentalTypeFilter;
    }
    if (statusFilter) {
      params.status = statusFilter;
    }
    if (dateRange.start) {
      params.start_date = dateRange.start.toISOString().split("T")[0];
    }
    if (dateRange.end) {
      params.end_date = dateRange.end.toISOString().split("T")[0];
    }

    return Object.keys(params).length > 0 ? params : undefined;
  }, [rentalTypeFilter, statusFilter, dateRange]);

  const { data, isLoading, isError } = useGetRentalPaymentsQuery(queryParams);

  const statusOptions = useMemo<StatusOption[]>(() => {
    return [
      { label: t("filters.status.draft"), value: "draft" },
      { label: t("filters.status.approved"), value: "approved" },
      { label: t("filters.status.paid"), value: "paid" },
    ];
  }, [t]);

  const rentalTypeOptions = useMemo<RentalTypeOption[]>(() => {
    return [
      { label: t("filters.type.vehicle"), value: "vehicle" },
      { label: t("filters.type.premises"), value: "premises" },
    ];
  }, [t]);

  const activeFilters = useMemo(() => {
    return !!search.trim() || !!dateRange.start || !!dateRange.end || !!statusFilter || !!rentalTypeFilter;
  }, [search, dateRange, statusFilter, rentalTypeFilter]);

  function handleSort(key: RentalPaymentSortKey) {
    setSortConfig((prev) => toggleRentalPaymentSort(prev, key));
  }

  const filteredPayments = useMemo(() => {
    if (!data) return [];

    return data.filter((payment) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          payment.vendor_name.toLowerCase().includes(searchLower) ||
          payment.avr_number.toLowerCase().includes(searchLower) ||
          String(payment.payment_number).includes(search);

        if (!matchesSearch) return false;
      }

      if (dateRange.start || dateRange.end) {
        const avrDate = new Date(payment.avr_date);
        if (!avrDate) return false;

        const normalizedDate = normalizeDateToStartOfDay(avrDate);
        const matches = matchesDateRange(normalizedDate, dateRange, normalizeDateToStartOfDay, normalizeDateToEndOfDay);
        if (!matches) return false;
      }

      return true;
    });
  }, [data, search, dateRange]);

  const sortedPayments = useRentalPaymentsSort(filteredPayments, sortConfig);
  const pagination = usePagination(sortedPayments.length, 10, [
    search,
    statusFilter,
    rentalTypeFilter,
    dateRange,
    sortConfig,
  ]);
  const pagePayments = sortedPayments.slice(pagination.startIndex, pagination.endIndex);

  function handleResetFilters() {
    setSearch("");
    setDateRange({ start: null, end: null });
    setStatusFilter(null);
    setRentalTypeFilter(null);
    setSortConfig(null);
  }

  return {
    data,
    isLoading,
    isError,
    search,
    setSearch,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    rentalTypeFilter,
    setRentalTypeFilter,
    statusOptions,
    rentalTypeOptions,
    activeFilters,
    locale,
    filteredPayments,
    sortConfig,
    handleSort,
    pagination,
    pagePayments,
    handleResetFilters,
    t,
  };
}

