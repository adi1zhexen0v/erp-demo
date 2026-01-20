import { DocumentText, TickCircle } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { Table, Badge } from "@/shared/ui";
import type { JournalEntriesResponse } from "@/features/accounting/reports/types";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { formatDateForDisplay } from "@/shared/utils";
import { usePagination } from "@/shared/hooks";
import Pagination from "@/shared/components/Pagination";
import { TableSectionSkeleton } from "./LoadingStates";

interface JournalEntriesTableProps {
  data?: JournalEntriesResponse;
  isLoading?: boolean;
  error?: unknown;
  startDate: string;
  endDate: string;
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation("ReportsPage");

  const statusConfig: Record<
    string,
    { color: "info" | "positive"; variant: "soft" | "outline"; icon: React.ReactNode }
  > = {
    draft: {
      color: "info",
      variant: "soft",
      icon: <DocumentText size={16} color="currentColor" />,
    },
    created: {
      color: "info",
      variant: "soft",
      icon: <DocumentText size={16} color="currentColor" />,
    },
    approved: {
      color: "positive",
      variant: "outline",
      icon: <TickCircle size={16} color="currentColor" />,
    },
    paid: {
      color: "positive",
      variant: "soft",
      icon: <TickCircle size={16} color="currentColor" variant="Bold" />,
    },
  };

  const config = statusConfig[status] || statusConfig.draft;
  const translationKey = `journalEntries.status.${status}`;
  const translatedText = t(translationKey as any);
  const statusText = translatedText && !translatedText.startsWith("journalEntries.") ? translatedText : status;

  return <Badge variant={config.variant} color={config.color} text={statusText} icon={config.icon} />;
}

function SourceTypeBadge({ sourceType }: { sourceType: string }) {
  const { t } = useTranslation("ReportsPage");
  const normalizedSourceType = sourceType.replace(/ТМЦ/g, "ТМЗ");
  const translationKey = `journalEntries.sourceType.${normalizedSourceType}`;
  const translatedText = t(translationKey as any);
  const sourceTypeText = translatedText && !translatedText.startsWith("journalEntries.") ? translatedText : normalizedSourceType;

  return <Badge variant="soft" color="info" text={sourceTypeText} />;
}

export default function JournalEntriesTable({ data, isLoading, error, startDate, endDate }: JournalEntriesTableProps) {
  const { t, i18n } = useTranslation("ReportsPage");
  const currentLang = (
    i18n.language === "ru" || i18n.language === "kk" || i18n.language === "en" ? i18n.language : "ru"
  ) as "ru" | "kk" | "en";

  const pagination = usePagination(data?.length || 0, 10, [data]);

  if (isLoading) {
    return <TableSectionSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
        <h3 className="text-body-semibold-lg content-base-primary mb-4">{t("journalEntries.title")}</h3>
        <div className="text-body-regular-md content-action-neutral">
          {error ? t("journalEntries.error") : t("journalEntries.empty")}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
          <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
            <span className="content-action-neutral">
              <DocumentText size={16} color="currentColor" />
            </span>
          </div>
          <span className="text-body-bold-lg content-base-primary">
            {t("journalEntries.title")} {t("journalEntries.forPeriod")} {formatDateForDisplay(startDate, false)} —{" "}
            {formatDateForDisplay(endDate, false)}
          </span>
        </div>
        <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
          <div className="text-body-regular-md content-action-neutral">{t("journalEntries.empty")}</div>
        </div>
      </div>
    );
  }

  const paginatedData = data.slice(pagination.startIndex, pagination.endIndex);

  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <DocumentText size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">
          {t("journalEntries.title")} {t("journalEntries.forPeriod")} {formatDateForDisplay(startDate, false)} —{" "}
          {formatDateForDisplay(endDate, false)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("journalEntries.table.date")}</Table.HeadCell>
              <Table.HeadCell>{t("journalEntries.table.debit")}</Table.HeadCell>
              <Table.HeadCell>{t("journalEntries.table.credit")}</Table.HeadCell>
              <Table.HeadCell>{t("journalEntries.table.description")}</Table.HeadCell>
              <Table.HeadCell>{t("journalEntries.table.source")}</Table.HeadCell>
              <Table.HeadCell>{t("journalEntries.table.status")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("journalEntries.table.amount")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            {paginatedData.map((entry) => {
              const descriptionText =
                entry.description[currentLang] || entry.description.kk || entry.description.en || entry.description.ru;
              const descriptionTextReplaced = descriptionText?.replace(/ТМЦ/g, "ТМЗ") || descriptionText;
              return (
                <Table.Row key={entry.id}>
                  <Table.Cell>{formatDateForDisplay(entry.entry_date, false)}</Table.Cell>
                  <Table.Cell>{entry.debit_account}</Table.Cell>
                  <Table.Cell>{entry.credit_account}</Table.Cell>
                  <Table.Cell>{descriptionTextReplaced}</Table.Cell>
                  <Table.Cell>
                    <SourceTypeBadge sourceType={entry.source_type} />
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={entry.status} />
                  </Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.amount)}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Table>
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        total={data.length}
        fromItem={pagination.fromItem}
        toItem={pagination.toItem}
        onPageChange={pagination.setPage}
      />
    </div>
  );
}

