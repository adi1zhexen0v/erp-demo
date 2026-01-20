import { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Import, ArrowDown2 } from "iconsax-react";
import { Breadcrumbs, Button, Dropdown, DropdownItem, Prompt } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { downloadBlob } from "@/shared/utils";
import {
  useDownloadBalanceSheetMutation,
  useDownloadPLReportMutation,
} from "../../api";
import { useFinancialReportsPage, useGetJournalEntries } from "../../hooks";
import { formatPeriod } from "../../utils";
import {
  HeaderSection,
  ReportsGrid,
  PLReportCard,
  BalanceSheetCard,
  CashFlowCard,
  DepreciationReportCard,
  TrialBalanceSection,
  JournalEntriesTable,
  ReportsGridSkeleton,
  HeaderSectionSkeleton,
  DepreciationReportCardSkeleton,
  TableSectionSkeleton,
} from "./components";

export default function FinancialReportsPage() {
  const { scrollRef, hasScroll } = useScrollDetection();
  const { t } = useTranslation("ReportsPage");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);
  const [downloadBalanceSheet, { isLoading: isDownloadingBalance }] = useDownloadBalanceSheetMutation();
  const [downloadPLReport, { isLoading: isDownloadingPL }] = useDownloadPLReportMutation();

  const {
    year,
    month,
    setYear,
    setMonth,
    appliedYear,
    appliedMonth,
    appliedPeriodDates,
    plReport,
    balanceSheet,
    cashFlow,
    trialBalance,
    depreciationReport,
    isLoadingPLReport,
    isLoadingBalanceSheet,
    isLoadingCashFlow,
    isLoadingTrialBalance,
    isLoadingDepreciationReport,
    isFetchingAny,
    plReportError,
    balanceSheetError,
    cashFlowError,
    trialBalanceError,
    depreciationReportError,
    hasPeriodChanged,
    handleRefresh,
  } = useFinancialReportsPage();

  const { start_date, end_date } = appliedPeriodDates;
  const isLoadingAny =
    isLoadingPLReport ||
    isLoadingBalanceSheet ||
    isLoadingCashFlow ||
    isLoadingTrialBalance ||
    isLoadingDepreciationReport;
  const showReportsSkeleton = isLoadingAny || isFetchingAny;

  const {
    data: journalEntries,
    isLoading: isLoadingJournalEntries,
    isFetching: isFetchingJournalEntries,
    isError: isJournalEntriesError,
    error: journalEntriesError,
  } = useGetJournalEntries({
    start_date,
    end_date,
  });

  async function handleDownloadBalanceSheet() {
    if (isDownloadingBalance || isDownloadingPL) return;
    setIsDownloadOpen(false);
    try {
      const blob = await downloadBalanceSheet(end_date).unwrap();
      const filename = `${t("downloadFilename.balanceSheet")}_${end_date}.xlsx`;
      downloadBlob(blob, filename);
      setPrompt({
        title: t("messages.downloadSuccess"),
        text: filename,
        variant: "success",
      });
      setTimeout(() => setPrompt(null), 2000);
    } catch (error) {
      setPrompt({
        title: t("messages.downloadFailed"),
        text: (error as Error).message || t("messages.downloadFailed"),
        variant: "error",
      });
    }
  }

  async function handleDownloadPLReport() {
    if (isDownloadingBalance || isDownloadingPL) return;
    setIsDownloadOpen(false);
    try {
      const blob = await downloadPLReport({ start_date, end_date }).unwrap();
      const filename = `${t("downloadFilename.plReport")}_${start_date}_${end_date}.xlsx`;
      downloadBlob(blob, filename);
      setPrompt({
        title: t("messages.downloadSuccess"),
        text: filename,
        variant: "success",
      });
      setTimeout(() => setPrompt(null), 2000);
    } catch (error) {
      setPrompt({
        title: t("messages.downloadFailed"),
        text: (error as Error).message || t("messages.downloadFailed"),
        variant: "error",
      });
    }
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
        <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.accounting") },
              { label: t("breadcrumbs.reports") },
            ]}
          />

          <div className="flex items-center justify-between mt-2 mb-6">
            <h1 className="text-display-xs content-base-primary">
              {t("titleForPeriod", {
                period: formatPeriod(appliedYear, appliedMonth),
              })}
            </h1>
            <Dropdown open={isDownloadOpen} onClose={() => setIsDownloadOpen(false)}>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="flex items-center gap-2">
                <Import size={16} color="currentColor" />
                <span>{t("download")}</span>
                <ArrowDown2 size={16} color="currentColor" />
              </Button>
              <DropdownItem onClick={handleDownloadBalanceSheet} disabled={isDownloadingBalance || isDownloadingPL}>
                {t("downloadBalanceSheet")}
              </DropdownItem>
              <DropdownItem onClick={handleDownloadPLReport} disabled={isDownloadingBalance || isDownloadingPL}>
                {t("downloadPLReport")}
              </DropdownItem>
            </Dropdown>
          </div>

          {(isDownloadingBalance || isDownloadingPL) && (
            <Prompt
              loaderMode={true}
              onClose={() => {}}
              title=""
              text=""
              loaderText={t("messages.loader.waitingForDownload.text")}
              additionalText={t("messages.loader.waitingForDownload.additionalText")}
              namespace="ReportsPage"
            />
          )}

          {prompt && (
            <Prompt
              title={prompt.title}
              text={prompt.text}
              variant={prompt.variant || "success"}
              onClose={() => setPrompt(null)}
              namespace="ReportsPage"
            />
          )}

          {showReportsSkeleton ? (
            <>
              <HeaderSectionSkeleton />
              <ReportsGridSkeleton />
              <DepreciationReportCardSkeleton />
              <TableSectionSkeleton />
              <TableSectionSkeleton />
            </>
          ) : (
            <>
              <HeaderSection
                year={year}
                month={month}
                onYearChange={setYear}
                onMonthChange={setMonth}
                hasPeriodChanged={hasPeriodChanged}
                onRefresh={handleRefresh}
                isLoading={isLoadingAny}
              />

              <ReportsGrid>
                <PLReportCard data={plReport} isLoading={isFetchingAny} error={plReportError} />
                <BalanceSheetCard data={balanceSheet} isLoading={isFetchingAny} error={balanceSheetError} />
                <CashFlowCard data={cashFlow} isLoading={isFetchingAny} error={cashFlowError} />
              </ReportsGrid>

              <DepreciationReportCard
                data={depreciationReport}
                isLoading={isFetchingAny}
                error={depreciationReportError}
              />

              <TrialBalanceSection data={trialBalance} isLoading={isFetchingAny} error={trialBalanceError} />

              <JournalEntriesTable
                data={journalEntries}
                isLoading={isLoadingJournalEntries || isFetchingJournalEntries}
                error={isJournalEntriesError ? journalEntriesError : undefined}
                startDate={start_date}
                endDate={end_date}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}

