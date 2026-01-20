import { useTranslation } from "react-i18next";
import { Clock, TickCircle } from "iconsax-react";
import { getMonthName } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import { Badge, Table } from "@/shared/ui";
import type { TimesheetResponse } from "../../../types";
import type { SortKey, SortConfig } from "../../../hooks";
import TimesheetActions from "./TimesheetActions";

interface Props {
  timesheets: TimesheetResponse[];
  onOpen: (id: number) => void;
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (id: number, year: number, month: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
}

export default function TimesheetsTable({
  timesheets,
  onOpen,
  onApprove,
  onDelete,
  onDownload,
  sortConfig,
  onSort,
}: Props) {
  const { t, i18n } = useTranslation("TimesheetsPage");
  const locale = (i18n.language as Locale) || "ru";

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex items-center gap-3">
        <div className="w-10 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
          <Clock size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-bold-lg content-base-primary">{t("section.title")}</h3>
          <p className="text-body-regular-sm content-action-neutral">{t("section.subtitle")}</p>
        </div>
      </div>

      <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell>{t("table.period")}</Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
              onSort={() => onSort("status")}>
              {t("table.status")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "workDays" ? sortConfig.direction : undefined}
              onSort={() => onSort("workDays")}>
              {t("table.workDays")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "workHours" ? sortConfig.direction : undefined}
              onSort={() => onSort("workHours")}>
              {t("table.workHours")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "entries" ? sortConfig.direction : undefined}
              onSort={() => onSort("entries")}>
              {t("table.entries")}
            </Table.HeadCell>
            <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {timesheets.map((timesheet, index) => (
            <Table.Row key={timesheet.id}>
              <Table.Cell isBold>
                {getMonthName(timesheet.month, locale)} {timesheet.year}
              </Table.Cell>
              <Table.Cell>
                <Badge
                  variant="soft"
                  color={timesheet.status === "draft" ? "info" : "positive"}
                  text={t(`status.${timesheet.status}`)}
                  icon={
                    timesheet.status === "draft" ? (
                      <Clock size={16} color="currentColor" />
                    ) : (
                      <TickCircle size={16} color="currentColor" variant="Bold" />
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell>{timesheet.sum_work_days}</Table.Cell>
              <Table.Cell>{timesheet.sum_work_hours}</Table.Cell>
              <Table.Cell>{timesheet.entries_count || 0}</Table.Cell>
              <Table.Cell>
                <TimesheetActions
                  timesheet={timesheet}
                  onOpen={onOpen}
                  onApprove={onApprove}
                  onDelete={onDelete}
                  onDownload={onDownload}
                  index={index}
                  totalCount={timesheets.length}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Table>
    </div>
  );
}

