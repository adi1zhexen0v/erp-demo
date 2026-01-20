import { useState, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { ACCOUNTING_TIMESHEETS_PAGE_ROUTE , extractErrorMessage } from "@/shared/utils";
import { useScrollDetection, useLocale } from "@/shared/hooks";
import { Prompt, PromptForm } from "@/shared/ui";
import { useGetTimesheetDetailQuery } from "../../api";
import { useTimesheetMutations, useTimesheetDownloads } from "../../hooks";
import {
  canEditTimesheet,
  getDaysInMonth,
  buildTimesheetUpdatePayload,
  getEntryStats as getEntryStatsUtil,
} from "../../utils";
import type { DailyData } from "../../types";
import {
  TimesheetDetailHeader,
  StatusCodeLegend,
  HolidaysLegend,
  TimesheetMonthStats,
  TimesheetActions,
  TimesheetDetailSkeleton,
} from "./components";

const TimesheetEditableTable = lazy(() => import("./components/TimesheetEditableTable").then((m) => ({ default: m.default })));

export default function TimesheetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation("TimesheetsPage");
  const { scrollRef, hasScroll } = useScrollDetection();
  const timesheetId = id ? parseInt(id, 10) : 0;

  const {
    data: timesheet,
    isLoading,
    refetch,
  } = useGetTimesheetDetailQuery(timesheetId, {
    skip: !timesheetId || isNaN(timesheetId),
  });

  const { handleBatchUpdateEntries, handleApprove, isApproving } = useTimesheetMutations((prompt) => {
    if (prompt) {
      setPromptState({
        title: prompt.title,
        text: prompt.text,
        variant: prompt.variant || "success",
      });
    } else {
      setPromptState(null);
    }
  });
  const { handleDownloadDocx, isDownloading } = useTimesheetDownloads((prompt) => {
    if (prompt) {
      setPromptState({
        title: prompt.title,
        text: prompt.text,
        variant: prompt.variant || "success",
      });
    } else {
      setPromptState(null);
    }
  });

  const [pendingChanges, setPendingChanges] = useState<Map<number, DailyData>>(new Map());
  const [promptState, setPromptState] = useState<{
    title: string;
    text: string;
    variant: "success" | "error" | "warning";
  } | null>(null);
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canEdit = timesheet ? canEditTimesheet(timesheet) : false;
  const locale = useLocale();
  const daysInMonth = useMemo(() => {
    if (!timesheet) return [];
    return Array.from({ length: getDaysInMonth(timesheet.year, timesheet.month) }, (_, i) => String(i + 1));
  }, [timesheet]);

  function hasPendingChanges(): boolean {
    return pendingChanges.size > 0;
  }

  async function handleSaveChanges() {
    if (isSaving || !timesheet || !hasPendingChanges()) return;

    try {
      setIsSaving(true);
      const updates = buildTimesheetUpdatePayload(pendingChanges, timesheet.entries || []);
      await handleBatchUpdateEntries(updates);
      setPendingChanges(new Map());
      await refetch();
    } catch (err) {
      setPromptState({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "messages.saveErrorText", t),
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleApproveConfirm() {
    if (!timesheet) return;
    await handleApprove(timesheet.id);
    setConfirmApprove(false);
  }

  function handleDownload() {
    if (isDownloading || !timesheet) return;
    handleDownloadDocx(timesheet.id, timesheet.year, timesheet.month);
  }

  function handleCellChange(entryId: number, day: string, code: string) {
    if (!timesheet) return;
    const entry = timesheet.entries?.find((e) => e.id === entryId);
    if (!entry) return;

    const currentData = pendingChanges.get(entryId) || entry.daily_data;
    const newData: DailyData = { ...currentData, [day]: code as DailyData[string] };

    setPendingChanges(new Map(pendingChanges).set(entryId, newData));
  }

  function getCellValue(entryId: number, day: string): string {
    if (!timesheet) return "";
    const entry = timesheet.entries?.find((e) => e.id === entryId);
    if (!entry) return "";
    const pendingData = pendingChanges.get(entryId);
    return pendingData?.[day] ?? entry.daily_data[day] ?? "";
  }

  function getEntryStats(entryId: number) {
    if (!timesheet) {
      return getEntryStatsUtil(undefined);
    }
    const entry = timesheet.entries?.find((e) => e.id === entryId);
    return getEntryStatsUtil(entry);
  }

  if (isLoading || !timesheet) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
          <div ref={scrollRef} className={cn("h-full page-scroll", hasScroll && "pr-5")}>
            <TimesheetDetailSkeleton />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden min-w-0">
        <div className="h-full min-w-0 flex flex-col">
          <div className="shrink-0">
            <TimesheetDetailHeader
              month={timesheet.month}
              year={timesheet.year}
              locale={locale}
              isApproved={timesheet.status === "approved"}
              onDownload={handleDownload}
              onClose={() => navigate(ACCOUNTING_TIMESHEETS_PAGE_ROUTE)}
            />
          </div>

          <div ref={scrollRef} className={cn("flex-1 overflow-y-auto min-h-0 page-scroll", hasScroll && "pr-5")}>
            <TimesheetMonthStats
              calendarDays={timesheet.total_calendar_days}
              holidayDays={timesheet.month_holiday_days}
              workDays={timesheet.month_work_days}
              workHours={timesheet.month_work_hours_8h}
            />

            <StatusCodeLegend />

            <HolidaysLegend month={timesheet.month} />

            <Suspense fallback={<TimesheetDetailSkeleton />}>
              <TimesheetEditableTable
                entries={timesheet.entries || []}
                daysInMonth={daysInMonth}
                year={timesheet.year}
                month={timesheet.month}
                canEdit={canEdit}
                getCellValue={getCellValue}
                onCellChange={handleCellChange}
                getEntryStats={getEntryStats}
              />
            </Suspense>
          </div>

          <div className="shrink-0">
            <TimesheetActions
              hasChanges={hasPendingChanges()}
              canEdit={canEdit}
              isSaving={isSaving}
              isApproving={isApproving}
              onSave={handleSaveChanges}
              onApprove={() => setConfirmApprove(true)}
            />
          </div>
        </div>
      </section>

      {isDownloading && (
        <Prompt
          loaderMode={true}
          onClose={() => {}}
          title=""
          text=""
          loaderText={t("messages.loader.waitingForDownload.text")}
          additionalText={t("messages.loader.waitingForDownload.additionalText")}
          namespace="TimesheetsPage"
        />
      )}

      {promptState && (
        <Prompt
          title={promptState.title}
          text={promptState.text}
          variant={promptState.variant}
          onClose={() => setPromptState(null)}
          namespace="TimesheetsPage"
        />
      )}

      {confirmApprove && (
        <PromptForm
          title={t("confirm.approveTitle")}
          text={t("confirm.approveText")}
          variant="warning"
          onClose={() => setConfirmApprove(false)}
          onConfirm={handleApproveConfirm}
          isLoading={isApproving}
          confirmText={t("confirm.approveConfirm")}
          cancelText={t("confirm.cancel")}
          namespace="TimesheetsPage"
        />
      )}
    </>
  );
}

