import { useState, lazy, Suspense } from "react";
import cn from "classnames";
import { Pagination } from "@/shared/components";
import { Prompt, PromptForm } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { usePurchasesListPage, usePurchasesModals, usePurchasesMutations } from "../../hooks";
import type { GroupedPurchase } from "../../types";
import {
  PurchasesHeader,
  PurchasesFilter,
  PurchasesPageSkeleton,
} from "./components";

const PurchasesTable = lazy(() => import("./components/PurchasesTable").then((m) => ({ default: m.default })));
const PurchaseCreateModal = lazy(() => import("./components/PurchaseCreateModal").then((m) => ({ default: m.default })));
const PurchaseInfoModal = lazy(() => import("./components/PurchaseInfoModal").then((m) => ({ default: m.default })));
const PurchaseDetailsModal = lazy(() => import("../PurchaseDetailsModal").then((m) => ({ default: m.default })));

export default function PurchasesPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [quickViewModal, setQuickViewModal] = useState<GroupedPurchase | null>(null);

  const {
    groupedData,
    isLoading,
    isError,
    filteredPurchases,
    pagination,
    pagePurchases,
    sortConfig,
    handleSort,
    search,
    setSearch,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    statusOptions,
    activeFilters,
    handleResetFilters,
    locale,
    t,
  } = usePurchasesListPage();

  const {
    prompt,
    setPrompt,
    createModal,
    setCreateModal,
    detailModal,
    setDetailModal,
    confirmDelete,
    setConfirmDelete,
    confirmApprove,
    setConfirmApprove,
    confirmMarkPaid,
    setConfirmMarkPaid,
  } = usePurchasesModals();

  const {
    approvingBatchId,
    markingPaidBatchId,
    deletingId,
    isApproving,
    isMarkingPaid,
    isDeleting,
    creating,
    extractingOCR,
    handleCreate,
    handleApprove,
    handleMarkPaid,
    handleDelete,
    handleExtractOCR,
  } = usePurchasesMutations(setPrompt);

  if (isLoading && groupedData.length === 0) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <PurchasesHeader onCreateClick={() => setCreateModal(true)} />
            <PurchasesPageSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <PurchasesHeader onCreateClick={() => setCreateModal(true)} />
          <p className="mt-4 text-body-regular-md content-action-negative">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  function findGroupByKey(key: string) {
    return groupedData.find((g) => g.invoice_key === key);
  }

  async function handleDeleteConfirm(invoiceKey: string) {
    const group = findGroupByKey(invoiceKey);
    if (!group || group.items.length === 0) {
      setConfirmDelete(null);
      return;
    }

    for (const item of group.items) {
      await handleDelete(item.id);
    }

    setConfirmDelete(null);
  }

  async function handleApproveConfirm(invoiceKey: string) {
    const group = findGroupByKey(invoiceKey);
    if (!group || group.items.length === 0) {
      setConfirmApprove(null);
      return;
    }

    const draftBatchIds = new Set<string>();
    group.items.forEach((item) => {
      if (item.transaction_status === "draft" && item.purchase_batch_id) {
        draftBatchIds.add(item.purchase_batch_id);
      }
    });

    for (const batchId of draftBatchIds) {
      await handleApprove(batchId);
    }

    setConfirmApprove(null);
  }

  async function handleMarkPaidConfirm(invoiceKey: string) {
    const group = findGroupByKey(invoiceKey);
    if (!group || group.items.length === 0) {
      setConfirmMarkPaid(null);
      return;
    }

    const approvedBatchIds = new Set<string>();
    group.items.forEach((item) => {
      if (item.transaction_status === "approved" && item.purchase_batch_id) {
        approvedBatchIds.add(item.purchase_batch_id);
      }
    });

    for (const batchId of approvedBatchIds) {
      await handleMarkPaid(batchId);
    }

    setConfirmMarkPaid(null);
  }

  const approvingKey = approvingBatchId
    ? groupedData.find(
        (g) =>
          g.purchase_batch_id === approvingBatchId || g.items.some((i) => i.purchase_batch_id === approvingBatchId),
      )?.invoice_key
    : null;
  const markingPaidKey = markingPaidBatchId
    ? groupedData.find(
        (g) =>
          g.purchase_batch_id === markingPaidBatchId || g.items.some((i) => i.purchase_batch_id === markingPaidBatchId),
      )?.invoice_key
    : null;
  const deletingKey = deletingId
    ? groupedData.find((g) => g.items.some((i) => i.id === deletingId))?.invoice_key
    : null;

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <PurchasesHeader onCreateClick={() => setCreateModal(true)} />

          <PurchasesFilter
            search={search}
            onSearchChange={setSearch}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            hasActiveFilters={activeFilters}
            onReset={handleResetFilters}
            locale={locale}
          />

          {filteredPurchases.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4 mt-4">{t("messages.noResults")}</p>
          ) : (
            <>
              <Suspense fallback={<PurchasesPageSkeleton />}>
                <PurchasesTable
                  purchases={pagePurchases}
                  onOpen={(invoiceKey) => {
                    const group = findGroupByKey(invoiceKey);
                    if (group) {
                      setDetailModal(group);
                    }
                  }}
                  onViewQuick={(invoiceKey) => {
                    const group = findGroupByKey(invoiceKey);
                    if (group) {
                      setQuickViewModal(group);
                    }
                  }}
                  onApprove={(invoiceKey) => setConfirmApprove(invoiceKey)}
                  onMarkPaid={(invoiceKey) => setConfirmMarkPaid(invoiceKey)}
                  onDelete={(invoiceKey) => setConfirmDelete(invoiceKey)}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  approvingKey={approvingKey}
                  markingPaidKey={markingPaidKey}
                  deletingKey={deletingKey}
                />
              </Suspense>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={pagination.setPage}
                fromItem={pagination.fromItem}
                toItem={pagination.toItem}
                total={filteredPurchases.length}
              />
            </>
          )}
        </div>
      </section>

      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
          namespace="PurchasesPage"
        />
      )}

      {confirmDelete !== null && (
        <PromptForm
          title={t("confirm.deleteTitle")}
          text={t("confirm.deleteText")}
          variant="error"
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDeleteConfirm(confirmDelete)}
          isLoading={isDeleting}
          confirmText={t("confirm.deleteConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PurchasesPage"
        />
      )}

      {confirmApprove !== null && (
        <PromptForm
          title={t("confirm.approveTitle")}
          text={t("confirm.approveText")}
          variant="success"
          onClose={() => setConfirmApprove(null)}
          onConfirm={() => handleApproveConfirm(confirmApprove)}
          isLoading={isApproving}
          confirmText={t("confirm.approveConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PurchasesPage"
        />
      )}

      {confirmMarkPaid !== null && (
        <PromptForm
          title={t("confirm.markPaidTitle")}
          text={t("confirm.markPaidText")}
          variant="success"
          onClose={() => setConfirmMarkPaid(null)}
          onConfirm={() => handleMarkPaidConfirm(confirmMarkPaid)}
          isLoading={isMarkingPaid}
          confirmText={t("confirm.markPaidConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="PurchasesPage"
        />
      )}

      {createModal && (
        <Suspense fallback={null}>
          <PurchaseCreateModal
            isOpen={createModal}
            onClose={() => setCreateModal(false)}
            onConfirm={handleCreate}
            onExtractOCR={handleExtractOCR}
            isLoading={creating}
            isExtractingOCR={extractingOCR}
          />
        </Suspense>
      )}

      {detailModal && (
        <Suspense fallback={null}>
          <PurchaseDetailsModal purchase={detailModal} onClose={() => setDetailModal(null)} />
        </Suspense>
      )}

      {quickViewModal && (
        <Suspense fallback={null}>
          <PurchaseInfoModal purchase={quickViewModal} onClose={() => setQuickViewModal(null)} />
        </Suspense>
      )}
    </>
  );
}

