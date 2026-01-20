import { useMemo, lazy, Suspense } from "react";
import cn from "classnames";
import { Pagination } from "@/shared/components";
import { Prompt } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { useEmployeesListPage } from "../../hooks";
import type { WorkerListItem } from "../../types";
import {
  EmployeesFilter,
  EmployeesHeader,
  EmployeesSummaryCards,
  EmployeesSummaryCardsSkeleton,
  EmployeesTableSkeleton,
  EmployeesViewToggle,
} from "./components";

const EmployeesTableView = lazy(() => import("./components/EmployeesTableView").then((m) => ({ default: m.default })));
const EmployeesCardsView = lazy(() => import("./components/EmployeesCardsView").then((m) => ({ default: m.default })));
const CreateLeaveForm = lazy(() => import("@/features/hr/leave-applications").then((m) => ({ default: m.CreateLeaveForm })));
const CreateMedicalLeaveForm = lazy(() => import("@/features/hr/leave-applications").then((m) => ({ default: m.CreateMedicalLeaveForm })));
const CreateResignationForm = lazy(() => import("@/features/hr/resignation-letters").then((m) => ({ default: m.CreateResignationForm })));
const ContractChangesModal = lazy(() => import("@/features/hr/amendments").then((m) => ({ default: m.ContractChangesModal })));

export default function EmployeesPage() {
  const { scrollRef, hasScroll } = useScrollDetection();

  const pageData = useEmployeesListPage();

  const summaryStats = useMemo(() => {
    const employees = pageData.data || [];
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp: WorkerListItem) => emp.status === "active").length;
    const totalSalary = employees.reduce((sum: number, emp: WorkerListItem) => {
      const salary = emp.active_contract?.salary_amount;
      if (salary) {
        const numSalary = typeof salary === "string" ? parseFloat(salary) : salary;
        return sum + (isNaN(numSalary) ? 0 : numSalary);
      }
      return sum;
    }, 0);

    return {
      totalEmployees,
      activeEmployees,
      totalSalary: Math.round(totalSalary),
    };
  }, [pageData.data]);
  if (pageData.isLoading && !pageData.data) {
    return (
      <>
        <title>{pageData.t("meta.title")}</title>
        <meta name="description" content={pageData.t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
          <div ref={scrollRef} className={cn("h-full page-scroll min-w-0 overflow-x-hidden", hasScroll && "pr-5")}>
            <EmployeesHeader />
            <EmployeesSummaryCardsSkeleton />
            <EmployeesFilter
              search={pageData.search}
              onSearchChange={pageData.setSearch}
              hireDateRange={pageData.hireDateRange}
              onHireDateRangeChange={pageData.setHireDateRange}
              statusFilter={pageData.statusFilter}
              onStatusChange={pageData.setStatusFilter}
              statusOptions={pageData.statusOptions}
              hasActiveFilters={pageData.activeFilters}
              onReset={pageData.handleResetFilters}
              locale={pageData.locale}
              disabled
            />
            <EmployeesTableSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (pageData.isError) {
    return (
      <>
        <title>{pageData.t("meta.title")}</title>
        <meta name="description" content={pageData.t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <EmployeesHeader />
          <p className="mt-4 text-body-regular-md text-negative-500">{pageData.t("messages.error")}</p>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{pageData.t("meta.title")}</title>
      <meta name="description" content={pageData.t("meta.description")} />

      {pageData.isDownloadingProfile && pageData.downloadingId && (
        <Prompt
          loaderMode={true}
          onClose={() => {}}
          title=""
          text=""
          loaderText={pageData.t("messages.loader.waitingForDownload.text")}
          additionalText={pageData.t("messages.loader.waitingForDownload.additionalText")}
          namespace="EmployeesPage"
        />
      )}

      {pageData.prompt && (
        <Prompt
          title={pageData.prompt.title}
          text={pageData.prompt.text}
          variant={pageData.prompt.variant || "success"}
          onClose={() => pageData.setPrompt(null)}
        />
      )}

      {pageData.leaveFormSuccess && (
        <Prompt
          title={pageData.t("leaveForm.successTitle")}
          text={pageData.t("leaveForm.successText")}
          variant="success"
          onClose={() => pageData.setLeaveFormSuccess(false)}
        />
      )}

      {pageData.medicalLeaveFormSuccess && (
        <Prompt
          title={pageData.t("leaveForm.successTitle")}
          text={pageData.t("leaveForm.successText")}
          variant="success"
          onClose={() => pageData.setMedicalLeaveFormSuccess(false)}
        />
      )}

      {pageData.resignationFormSuccess && (
        <Prompt
          title={pageData.t("resignationForm.successTitle")}
          text={pageData.t("resignationForm.successText")}
          variant="success"
          onClose={() => pageData.setResignationFormSuccess(false)}
        />
      )}

      {pageData.leaveFormEmployee && (
        <Suspense fallback={null}>
          <CreateLeaveForm
            employee={pageData.leaveFormEmployee}
            annualLeaves={pageData.annualLeaves || []}
            unpaidLeaves={pageData.unpaidLeaves || []}
            medicalLeaves={pageData.medicalLeaves}
            onClose={() => pageData.setLeaveFormEmployee(null)}
            onSuccess={() => {
              pageData.setLeaveFormEmployee(null);
              pageData.setLeaveFormSuccess(true);
            }}
          />
        </Suspense>
      )}

      {pageData.medicalLeaveFormEmployee && (
        <Suspense fallback={null}>
          <CreateMedicalLeaveForm
            employee={pageData.medicalLeaveFormEmployee}
            annualLeaves={pageData.annualLeaves}
            unpaidLeaves={pageData.unpaidLeaves}
            medicalLeaves={pageData.medicalLeaves || []}
            onClose={() => pageData.setMedicalLeaveFormEmployee(null)}
            onSuccess={() => {
              pageData.setMedicalLeaveFormEmployee(null);
              pageData.setMedicalLeaveFormSuccess(true);
            }}
          />
        </Suspense>
      )}

      {pageData.resignationFormEmployee && (
        <Suspense fallback={null}>
          <CreateResignationForm
            employee={pageData.resignationFormEmployee}
            onClose={() => pageData.setResignationFormEmployee(null)}
            onSuccess={() => {
              pageData.setResignationFormEmployee(null);
              pageData.setResignationFormSuccess(true);
            }}
          />
        </Suspense>
      )}

      {pageData.contractChangesEmployee && (
        <Suspense fallback={null}>
          <ContractChangesModal
            employee={pageData.contractChangesEmployee}
            onClose={() => pageData.setContractChangesEmployee(null)}
          />
        </Suspense>
      )}

      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div ref={scrollRef} className={cn("h-full page-scroll min-w-0 overflow-x-hidden", hasScroll && "pr-5")}>
          <EmployeesHeader />
          <EmployeesSummaryCards
            totalEmployees={summaryStats.totalEmployees}
            activeEmployees={summaryStats.activeEmployees}
            totalSalary={summaryStats.totalSalary}
          />

          <EmployeesFilter
            search={pageData.search}
            onSearchChange={pageData.setSearch}
            hireDateRange={pageData.hireDateRange}
            onHireDateRangeChange={pageData.setHireDateRange}
            statusFilter={pageData.statusFilter}
            onStatusChange={pageData.setStatusFilter}
            statusOptions={pageData.statusOptions}
            hasActiveFilters={pageData.activeFilters}
            onReset={pageData.handleResetFilters}
            locale={pageData.locale}
          />

          <EmployeesViewToggle
            view={pageData.view}
            onChange={pageData.setView}
            amountOfEmployees={pageData.sortedWorkers.length}
          />

          {pageData.sortedWorkers.length === 0 ? (
            <p className="text-body-regular-md content-action-neutral mb-4">{pageData.t("messages.noResults")}</p>
          ) : pageData.view === "table" ? (
            <Suspense fallback={<EmployeesTableSkeleton />}>
              <EmployeesTableView
                employees={pageData.pageWorkers}
                rowStates={pageData.rowStates}
                headerState={pageData.headerState}
                onToggleRow={pageData.onToggleRow}
                onToggleHeader={pageData.onToggleHeader}
                sortConfig={pageData.sortConfig}
                onSort={pageData.handleSort}
                onDownloadProfile={pageData.handleDownloadProfile}
                isDownloading={pageData.isDownloadingProfile}
                onOpenLeaveForm={(employee) => pageData.setLeaveFormEmployee(employee)}
                onOpenMedicalLeaveForm={(employee) => pageData.setMedicalLeaveFormEmployee(employee)}
                onOpenResignationForm={(employee) => pageData.setResignationFormEmployee(employee)}
                onOpenContractChanges={(employee) => pageData.setContractChangesEmployee(employee)}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<EmployeesTableSkeleton />}>
              <EmployeesCardsView
                employees={pageData.pageWorkers}
                onDownloadProfile={pageData.handleDownloadProfile}
                isDownloading={pageData.isDownloadingProfile}
                onOpenLeaveForm={(employee) => pageData.setLeaveFormEmployee(employee)}
                onOpenMedicalLeaveForm={(employee) => pageData.setMedicalLeaveFormEmployee(employee)}
                onOpenResignationForm={(employee) => pageData.setResignationFormEmployee(employee)}
                onOpenContractChanges={(employee) => pageData.setContractChangesEmployee(employee)}
              />
            </Suspense>
          )}

          <Pagination
            currentPage={pageData.pagination.page}
            totalPages={pageData.pagination.totalPages}
            onPageChange={pageData.pagination.setPage}
            fromItem={pageData.pagination.fromItem}
            toItem={pageData.pagination.toItem}
            total={pageData.sortedWorkers.length}
          />
        </div>
      </section>
    </>
  );
}
