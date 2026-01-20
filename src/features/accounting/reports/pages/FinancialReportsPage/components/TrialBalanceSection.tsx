import { ReceiptText } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { Table, Toast } from "@/shared/ui";
import type { TrialBalanceResponse } from "@/features/accounting/reports/types";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber , formatDateForDisplay } from "@/shared/utils";
import { TableSectionSkeleton } from "./LoadingStates";

interface TrialBalanceSectionProps {
  data?: TrialBalanceResponse;
  isLoading?: boolean;
  error?: unknown;
}

export default function TrialBalanceSection({ data, isLoading, error }: TrialBalanceSectionProps) {
  const { t } = useTranslation("ReportsPage");

  if (isLoading) {
    return <TableSectionSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
        <h3 className="text-body-semibold-lg content-base-primary mb-4">{t("trialBalance.title")}</h3>
        <div className="text-body-regular-md content-action-neutral">
          {error ? t("messages.error") : t("messages.noResults")}
        </div>
      </div>
    );
  }

  const totalOpeningDebit = data.rows.reduce((sum, row) => sum + toNumber(row.opening_debit), 0);
  const totalOpeningCredit = data.rows.reduce((sum, row) => sum + toNumber(row.opening_credit), 0);
  const totalDebitTurnover = data.rows.reduce((sum, row) => sum + toNumber(row.debit_turnover), 0);
  const totalCreditTurnover = data.rows.reduce((sum, row) => sum + toNumber(row.credit_turnover), 0);
  const totalClosingDebit = data.rows.reduce((sum, row) => sum + toNumber(row.closing_debit), 0);
  const totalClosingCredit = data.rows.reduce((sum, row) => sum + toNumber(row.closing_credit), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <ReceiptText size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">
          {t("trialBalance.title")} {t("trialBalance.forPeriod")} {formatDateForDisplay(data.start_date)} —{" "}
          {formatDateForDisplay(data.end_date)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("trialBalance.table.code")}</Table.HeadCell>
              <Table.HeadCell>{t("trialBalance.table.name")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("trialBalance.table.openingDebit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("trialBalance.table.openingCredit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("trialBalance.table.debitTurnover")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("trialBalance.table.creditTurnover")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("trialBalance.table.closingDebit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("trialBalance.table.closingCredit")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            {data.rows.map((row) => (
              <Table.Row key={row.code}>
                <Table.Cell>{row.code}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.opening_debit)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.opening_credit)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.debit_turnover)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.credit_turnover)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.closing_debit)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.closing_credit)}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell isBold>{t("trialBalance.table.total")}</Table.Cell>
              <Table.Cell isBold>—</Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalOpeningDebit.toString())}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalOpeningCredit.toString())}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalDebitTurnover.toString())}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalCreditTurnover.toString())}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalClosingDebit.toString())}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalClosingCredit.toString())}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>

      {data.is_balanced ? (
        <Toast color="positive" text={t("trialBalance.balanced")} closable={false} autoClose={false} />
      ) : (
        <Toast color="negative" text={t("trialBalance.unbalanced")} closable={false} autoClose={false} />
      )}
    </div>
  );
}

