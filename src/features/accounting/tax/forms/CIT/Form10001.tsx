import { useTranslation } from "react-i18next";
import { InfoCircle } from "iconsax-react";
import { Table } from "@/shared/ui";
import type { Form10001Data } from "@/features/accounting/tax";
import { formatMoneyKzt } from "@/shared/utils";

interface Props {
  data: Form10001Data;
}

export default function Form10001({ data }: Props) {
  const { t } = useTranslation("TaxPage");

  return (
    <div className="flex flex-col gap-6 mt-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-body-bold-md content-base-primary">{t("form10001.title")}</h3>
        <p className="text-body-regular-sm content-action-neutral flex items-center gap-1.5">
          <InfoCircle size={16} color="currentColor" /> {t("form10001.appendix")}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("form10001.rowNumber")}</Table.HeadCell>
              <Table.HeadCell>{t("common.binIin")}</Table.HeadCell>
              <Table.HeadCell>{t("common.vendor")}</Table.HeadCell>
              <Table.HeadCell>{t("form10001.code")}</Table.HeadCell>
              <Table.HeadCell>{t("common.expenseType")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            {data.entries.map((entry) => (
              <Table.Row key={entry.row_number}>
                <Table.Cell>{entry.row_number}</Table.Cell>
                <Table.Cell>{entry.vendor_bin}</Table.Cell>
                <Table.Cell>{entry.vendor_name}</Table.Cell>
                <Table.Cell>{entry.expense_type_code}</Table.Cell>
                <Table.Cell>{entry.expense_type_name}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(entry.amount)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Table>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-bold-md content-base-primary">{t("common.expenseTypeTotal")}</h3>
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("common.expenseTypeName")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{t("common.financialServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_financial)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.advertisingServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_advertising)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.consultingServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_consulting)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.marketingServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_marketing)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.designServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_design)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.engineeringServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_engineering)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.otherServices")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.total_other)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell isBold>{t("common.allTotal")}</Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(data.grand_total)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>
    </div>
  );
}
