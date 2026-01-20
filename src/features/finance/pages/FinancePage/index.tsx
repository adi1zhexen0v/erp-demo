import { useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Skeleton } from "@/shared/ui";
import { FINANCE_PAGE_ROUTE } from "@/shared/utils";
import { useGetBudgetSummaryQuery } from "../../api";
import { buildYearRange, getCurrentYear, getLocalizedText, removeSectionNumber } from "../../utils";
import { BudgetKpiHeader } from "../../components/BudgetKpiHeader";
import { BudgetSectionDetails } from "../../components/BudgetSectionDetails";
import { BudgetFooterSummary } from "../../components/BudgetFooterSummary";
import { FinancePageSkeleton } from "../../components/FinancePageSkeleton";
import type { BudgetSection } from "../../types/api";

const BudgetPieChart = lazy(() => import("../../components/BudgetPieChart").then((m) => ({ default: m.BudgetPieChart })));

type ViewMode = "summary" | "section";

export default function FinancePage() {
  const { t, i18n } = useTranslation("FinancePage");
  const locale = i18n.language || "ru";
  const currentYear = getCurrentYear();
  const period = buildYearRange(currentYear);
  const [view, setView] = useState<ViewMode>("summary");
  const [activeSection, setActiveSection] = useState<BudgetSection | null>(null);

  const { data, isLoading, error, refetch } = useGetBudgetSummaryQuery(period);

  function handleSectionClick(section: BudgetSection) {
    setActiveSection(section);
    setView("section");
  }

  function handleBackToSummary() {
    setView("summary");
    setActiveSection(null);
  }

  function getPageTitle(): string {
    if (view === "section" && activeSection) {
      return t("meta.titleSection", { section: removeSectionNumber(getLocalizedText(activeSection.name, locale)) });
    }
    return t("meta.title");
  }

  const breadcrumbs =
    view === "section" && activeSection
      ? [{ label: t("breadcrumbs.finance"), href: FINANCE_PAGE_ROUTE }, { label: removeSectionNumber(getLocalizedText(activeSection.name, locale)) }]
      : [{ label: t("breadcrumbs.finance") }];

  if (isLoading) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div className="h-full page-scroll pr-5">
            <Breadcrumbs items={[{ label: t("breadcrumbs.finance") }]} />
            <Skeleton height={32} width={200} className="mt-2 mb-6" />
            <FinancePageSkeleton />
          </div>
        </section>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-body-regular-lg content-base-secondary">
              {error ? t("page.errorLoading") : t("page.noData")}
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 background-brand-fill text-white rounded-md hover:opacity-90 transition-opacity">
              {t("page.retry")}
            </button>
          </div>
        </section>
      </>
    );
  }

  if (data.sections.length === 0) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-body-regular-lg content-base-secondary">{t("page.emptyState")}</div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <title>{getPageTitle()}</title>
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div className="h-full page-scroll pr-5">
          <div
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const link = target.closest("a");
              if (link && link.getAttribute("href") === FINANCE_PAGE_ROUTE && view === "section") {
                e.preventDefault();
                e.stopPropagation();
                handleBackToSummary();
              }
            }}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <h1 className="text-display-xs content-base-primary mt-2 mb-6">
            {view === "section" && activeSection ? removeSectionNumber(getLocalizedText(activeSection.name, locale)) : t("page.title")}
          </h1>

          <div className="mt-6">
            {view === "summary" ? (
              <div className="grid grid-cols-[1fr_2fr] gap-5">
                <BudgetKpiHeader
                  plannedBudget={data.planned_budget}
                  grandTotal={data.grand_total}
                  remainingBudget={data.remaining_budget}
                  executionPercentage={data.execution_percentage}
                />
                <Suspense fallback={<Skeleton height={400} className="radius-lg" />}>
                  <BudgetPieChart sections={data.sections} onSectionClick={handleSectionClick} />
                </Suspense>
              </div>
            ) : (
              activeSection && <BudgetSectionDetails section={activeSection} />
            )}
          </div>

          {view === "summary" && (
            <div className="mt-6">
              <BudgetFooterSummary
                grandTotal={data.grand_total}
                plannedBudget={data.planned_budget}
                sections={data.sections}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
