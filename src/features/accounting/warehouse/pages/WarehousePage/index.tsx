import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import cn from "classnames";
import { ArrowLeft2 } from "iconsax-react";
import { Pagination } from "@/shared/components";
import { Prompt, PromptForm, Button } from "@/shared/ui";
import { useScrollDetection, usePagination } from "@/shared/hooks";
import { useWarehouseListPage, useWarehouseModals, useWarehouseMutations, useWarehouseSort } from "../../hooks";
import type { AssignItemDto } from "../../types";
import {
  WarehouseHeader,
  WarehouseSummaryCards,
  WarehousePageSkeleton,
  WarehouseFilters,
} from "./components";

const WarehouseTable = lazy(() => import("./components/WarehouseTable").then((m) => ({ default: m.default })));
const WarehouseGroupsTable = lazy(() => import("./components/WarehouseGroupsTable").then((m) => ({ default: m.default })));
const AssetAssignModal = lazy(() => import("./components/AssetAssignModal").then((m) => ({ default: m.default })));
const ItemDetailsModal = lazy(() => import("./components/ItemDetailsModal").then((m) => ({ default: m.default })));

export default function WarehousePage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    filteredItems,
    groupedUnits,
    getGroupedUnits,
    sortConfig,
    handleSort,
    search,
    setSearch,
    assetTypeFilter,
    setAssetTypeFilter,
    statusFilter,
    setStatusFilter,
    vendorFilter,
    setVendorFilter,
    assetTypeOptions,
    statusOptions,
    vendorOptions,
    activeFilters,
    handleResetFilters,
    locale,
    summary,
    t,
  } = useWarehouseListPage();

  const {
    prompt,
    setPrompt,
    assignModal,
    setAssignModal,
    detailsModal,
    setDetailsModal,
    confirmWriteOff,
    setConfirmWriteOff,
  } = useWarehouseModals();

  const { assigningId, writingOffId, isAssigning, isWritingOff, handleAssign, handleReturn, handleWriteOff } =
    useWarehouseMutations(setPrompt);

  useEffect(() => {
    if (selectedGroup !== null) {
      const groupExists = groupedUnits.some((g) => g.groupName === selectedGroup);
      if (!groupExists) {
        setSelectedGroup(null);
      }
    }
  }, [selectedGroup, groupedUnits]);

  const groupUnits = useMemo(() => {
    if (selectedGroup === null) return [];
    return getGroupedUnits(selectedGroup);
  }, [selectedGroup, getGroupedUnits]);

  const groupsPagination = usePagination(groupedUnits.length, 10, [
    search,
    assetTypeFilter,
    statusFilter,
    vendorFilter,
    selectedGroup,
  ]);
  const pageGroups = groupedUnits.slice(groupsPagination.startIndex, groupsPagination.endIndex);

  const sortedGroupUnits = useWarehouseSort(groupUnits, sortConfig);
  const unitsPagination = usePagination(sortedGroupUnits.length, 10, [selectedGroup, sortConfig]);
  const pageGroupUnits = sortedGroupUnits.slice(unitsPagination.startIndex, unitsPagination.endIndex);

  if (isLoading && !data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <WarehouseHeader />
            <WarehousePageSkeleton />
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
          <WarehouseHeader />
          <p className="mt-4 text-body-regular-md text-negative-500">{t("messages.error")}</p>
        </section>
      </>
    );
  }

  async function handleWriteOffConfirm(id: number) {
    await handleWriteOff(id, { reason: t("writeOff.defaultReason") });
    setConfirmWriteOff(null);
  }

  async function handleAssignConfirm(id: number, dto: AssignItemDto) {
    await handleAssign(id, dto);
  }

  function handleGroupSelect(groupName: string) {
    setSelectedGroup(groupName);
  }

  function handleBackToGroups() {
    setSelectedGroup(null);
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <WarehouseHeader />

          <WarehouseSummaryCards summary={summary} />

          {selectedGroup !== null && (
            <WarehouseFilters
              search={search}
              onSearchChange={setSearch}
              assetTypeFilter={assetTypeFilter}
              onAssetTypeChange={setAssetTypeFilter}
              assetTypeOptions={assetTypeOptions}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              statusOptions={statusOptions}
              vendorFilter={vendorFilter}
              onVendorChange={setVendorFilter}
              vendorOptions={vendorOptions}
              hasActiveFilters={activeFilters}
              onReset={() => {
                handleResetFilters();
                setSelectedGroup(null);
              }}
              locale={locale}
              disabled={isLoading}
            />
          )}

          {filteredItems.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4 mt-4">{t("messages.noResults")}</p>
          ) : selectedGroup === null ? (
            <>
              <Suspense fallback={<WarehousePageSkeleton />}>
                <WarehouseGroupsTable groups={pageGroups} onGroupSelect={handleGroupSelect} />
              </Suspense>

              <Pagination
                currentPage={groupsPagination.page}
                totalPages={groupsPagination.totalPages}
                onPageChange={groupsPagination.setPage}
                fromItem={groupsPagination.fromItem}
                toItem={groupsPagination.toItem}
                total={groupedUnits.length}
              />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleBackToGroups}
                  className="flex items-center gap-2 ml-0.5">
                  <ArrowLeft2 size={12} color="currentColor" />
                  {t("actions.back")}
                </Button>
                <h2 className="text-body-bold-lg content-base-primary">{selectedGroup}</h2>
              </div>

              <Suspense fallback={<WarehousePageSkeleton />}>
                <WarehouseTable
                  items={pageGroupUnits}
                  onOpen={(id) => setDetailsModal(id)}
                  onAssign={(id) =>
                    setAssignModal(Array.isArray(data) ? data.find((item) => item.id === id) || null : null)
                  }
                  onReturn={(id) => handleReturn(id)}
                  onWriteOff={(id) => setConfirmWriteOff(id)}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  assigningId={assigningId}
                  writingOffId={writingOffId}
                  hideStatusColumn={selectedGroup !== t("groups.unassigned")}
                />
              </Suspense>

              <Pagination
                currentPage={unitsPagination.page}
                totalPages={unitsPagination.totalPages}
                onPageChange={unitsPagination.setPage}
                fromItem={unitsPagination.fromItem}
                toItem={unitsPagination.toItem}
                total={groupUnits.length}
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
          namespace="WarehousePage"
        />
      )}

      {confirmWriteOff !== null && (
        <PromptForm
          title={t("confirm.writeOffTitle")}
          text={t("confirm.writeOffText")}
          variant="error"
          onClose={() => setConfirmWriteOff(null)}
          onConfirm={() => handleWriteOffConfirm(confirmWriteOff)}
          isLoading={isWritingOff}
          confirmText={t("confirm.writeOffConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="WarehousePage"
        />
      )}

      {assignModal && (
        <Suspense fallback={null}>
          <AssetAssignModal
            item={assignModal}
            onClose={() => setAssignModal(null)}
            onConfirm={handleAssignConfirm}
            isLoading={isAssigning}
            hasBackground={detailsModal === null}
          />
        </Suspense>
      )}

      {detailsModal !== null && (
        <Suspense fallback={null}>
          <ItemDetailsModal
            itemId={detailsModal}
            onClose={() => setDetailsModal(null)}
            onAssign={(id) => setAssignModal(Array.isArray(data) ? data.find((item) => item.id === id) || null : null)}
            onReturn={(id) => handleReturn(id)}
            onWriteOff={(id) => setConfirmWriteOff(id)}
            assigningId={assigningId}
            writingOffId={writingOffId}
          />
        </Suspense>
      )}
    </>
  );
}

