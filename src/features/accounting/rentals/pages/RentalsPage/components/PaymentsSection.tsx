import { useTranslation } from "react-i18next";
import { Pagination } from "@/shared/components";
import type { RentalPaymentListItem } from "../../../types";
import type { UseRentalPaymentsListPageReturn } from "../../../hooks";
import PaymentsTable from "./PaymentsTable";
import PaymentsFilter from "./PaymentsFilter";

interface Props {
  listPage: UseRentalPaymentsListPageReturn;
  onOpen: (id: number) => void;
  onEdit: (payment: RentalPaymentListItem) => void;
  onApprove: (id: number) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  approvingId?: number | null;
  markingPaidId?: number | null;
  deletingId?: number | null;
  isAnyModalOpen?: boolean;
}

export default function PaymentsSection({
  listPage,
  onOpen,
  onEdit,
  onApprove,
  onMarkPaid,
  onDelete,
  approvingId,
  markingPaidId,
  deletingId,
  isAnyModalOpen = false,
}: Props) {
  const { t } = useTranslation("RentalsPage");

  return (
    <>
      <PaymentsFilter
        search={listPage.search}
        onSearchChange={listPage.setSearch}
        dateRange={listPage.dateRange}
        onDateRangeChange={listPage.setDateRange}
        statusFilter={listPage.statusFilter}
        onStatusChange={listPage.setStatusFilter}
        rentalTypeFilter={listPage.rentalTypeFilter}
        onRentalTypeChange={listPage.setRentalTypeFilter}
        statusOptions={listPage.statusOptions}
        rentalTypeOptions={listPage.rentalTypeOptions}
        hasActiveFilters={listPage.activeFilters}
        onReset={listPage.handleResetFilters}
        locale={listPage.locale}
        disabled={listPage.isLoading}
      />

      {listPage.filteredPayments.length === 0 ? (
        <p className="text-body-regular-md content-action-neutral mb-4 mt-4">{t("messages.noResults")}</p>
      ) : (
        <>
          <PaymentsTable
            payments={listPage.pagePayments}
            onOpen={onOpen}
            onEdit={onEdit}
            onApprove={onApprove}
            onMarkPaid={onMarkPaid}
            onDelete={onDelete}
            sortConfig={listPage.sortConfig}
            onSort={listPage.handleSort}
            approvingId={approvingId}
            markingPaidId={markingPaidId}
            deletingId={deletingId}
            isAnyModalOpen={isAnyModalOpen}
          />

          <Pagination
            currentPage={listPage.pagination.page}
            totalPages={listPage.pagination.totalPages}
            onPageChange={listPage.pagination.setPage}
            fromItem={listPage.pagination.fromItem}
            toItem={listPage.pagination.toItem}
            total={listPage.filteredPayments.length}
          />
        </>
      )}
    </>
  );
}

