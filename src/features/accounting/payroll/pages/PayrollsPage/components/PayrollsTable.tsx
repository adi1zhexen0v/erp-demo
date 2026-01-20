import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InfoCircle, Wallet } from "iconsax-react";
import { Table, Dropdown } from "@/shared/ui";
import { formatDateForDisplay, formatMoneyKzt, getMonthName } from "@/shared/utils";
import {
  getPayrollRowTotals,
  type PayrollListResponse,
  type SortKey,
  type SortConfig,
} from "@/features/accounting/payroll";
import PayrollActions from "./PayrollActions";
import StatusBadge from "./StatusBadge";

interface Props {
  payrolls: PayrollListResponse[];
  onOpen: (id: number) => void;
  onApprove: (id: number) => void;
  onMarkPaid: (id: number) => void;
  onDelete: (id: number) => void;
  onRecalculate: (id: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
  approvingId?: number | null;
  markingPaidId?: number | null;
  deletingId?: number | null;
  recalculatingId?: number | null;
}

export default function PayrollsTable({
  payrolls,
  onOpen,
  onApprove,
  onMarkPaid,
  onDelete,
  onRecalculate,
  sortConfig,
  onSort,
  approvingId,
  markingPaidId,
  deletingId,
  recalculatingId,
}: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";
  const [hoveredWorkerIndex, setHoveredWorkerIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex items-center gap-3">
        <div className="w-10 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
          <Wallet size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-bold-lg content-base-primary">{t("section.title")}</h3>
          <p className="text-body-regular-sm content-action-neutral">{t("section.subtitle")}</p>
        </div>
      </div>

      <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "period" ? sortConfig.direction : undefined}
              onSort={() => onSort("period")}>
              {t("table.period")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
              onSort={() => onSort("status")}>
              {t("table.status")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "workers" ? sortConfig.direction : undefined}
              onSort={() => onSort("workers")}>
              {t("table.workers")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "gross" ? sortConfig.direction : undefined}
              onSort={() => onSort("gross")}>
              {t("table.gross")}
            </Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "net" ? sortConfig.direction : undefined}
              onSort={() => onSort("net")}>
              {t("table.net")}
            </Table.HeadCell>
            <Table.HeadCell>{t("detail.entries.totalTaxes")}</Table.HeadCell>
            <Table.HeadCell>{t("detail.entries.employerCost")}</Table.HeadCell>
            <Table.HeadCell>{t("table.generatedBy")}</Table.HeadCell>
            <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {payrolls.map((payroll, index) => {
            const totals = getPayrollRowTotals(payroll);
            return (
              <Table.Row key={payroll.id}>
                <Table.Cell isBold>
                  {getMonthName(payroll.month, locale)} {payroll.year}
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={payroll.status} t={t} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <span>
                      {payroll.worker_count}
                      {payroll.gph_payments_count > 0 && ` (${payroll.gph_payments_count})`}
                    </span>
                    {payroll.gph_payments_count > 0 && (
                      <div
                        className="relative h-full flex items-center"
                        onMouseEnter={() => setHoveredWorkerIndex(index)}
                        onMouseLeave={() => setHoveredWorkerIndex(null)}>
                        <Dropdown
                          open={hoveredWorkerIndex === index}
                          onClose={() => setHoveredWorkerIndex(null)}
                          direction="bottom"
                          align="left"
                          width="w-max"
                          className="elevation-level-2!">
                          <span className="content-action-neutral cursor-pointer">
                            <InfoCircle size={16} color="currentColor" />
                          </span>
                          <div
                            className="p-2 max-w-[200px]"
                            onMouseEnter={() => setHoveredWorkerIndex(index)}
                            onMouseLeave={() => setHoveredWorkerIndex(null)}>
                            <p className="text-label-xs content-action-neutral mb-1">
                              {t("detail.accrual.employees")}: {payroll.worker_count}
                            </p>
                            <p className="text-label-xs content-action-neutral">
                              {t("detail.accrual.contractors")}: {payroll.gph_payments_count}
                            </p>
                          </div>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>{formatMoneyKzt(totals.gross, locale)}</Table.Cell>
                <Table.Cell isBold className="text-positive-600">
                  {formatMoneyKzt(totals.net, locale)}
                </Table.Cell>
                <Table.Cell>{formatMoneyKzt(totals.taxes, locale)}</Table.Cell>
                <Table.Cell>{formatMoneyKzt(totals.employerCost, locale)}</Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col">
                    <span className="text-body-regular-sm content-base-primary">
                      {payroll.generated_by?.full_name || "-"}
                    </span>
                    <span className="text-label-xs content-action-neutral">
                      {payroll.generated_at ? formatDateForDisplay(payroll.generated_at, false) : "-"}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <PayrollActions
                    payroll={payroll}
                    onOpen={onOpen}
                    onApprove={onApprove}
                    onMarkPaid={onMarkPaid}
                    onDelete={onDelete}
                    onRecalculate={onRecalculate}
                    index={index}
                    totalCount={payrolls.length}
                    approvingId={approvingId}
                    markingPaidId={markingPaidId}
                    deletingId={deletingId}
                    recalculatingId={recalculatingId}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Table>
    </div>
  );
}
