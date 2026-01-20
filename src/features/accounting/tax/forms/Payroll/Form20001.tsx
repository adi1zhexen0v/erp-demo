import { useTranslation } from "react-i18next";
import { Table } from "@/shared/ui";
import type { Form20001Response } from "@/features/accounting/tax";
import { formatMoneyKzt , getMonthKeysForQuarter, getLocalizedMonthNames } from "@/shared/utils";
import { calculateSocialTaxBase } from "@/features/accounting/tax/utils";


interface Props {
  data: Form20001Response;
}

export default function Form20001({ data }: Props) {
  const { t } = useTranslation("TaxPage");
  const monthKeys = getMonthKeysForQuarter(data.quarter);
  const monthNames = getLocalizedMonthNames(monthKeys, t);

  const ipnSectionRows = [
    {
      code: "200.01.001",
      indicator: t("common.accruedIncome"),
      month1: data.month1.accrued_income,
      month2: data.month2.accrued_income,
      month3: data.month3.accrued_income,
      total: data.quarter_total.accrued_income,
    },
    {
      code: "200.01.003",
      indicator: t("common.ipnCalculated"),
      month1: data.month1.ipn,
      month2: data.month2.ipn,
      month3: data.month3.ipn,
      total: data.quarter_total.ipn,
    },
    {
      code: "200.01.007",
      indicator: t("common.paidIncome"),
      month1: data.month1.total_salary,
      month2: data.month2.total_salary,
      month3: data.month3.total_salary,
      total: data.quarter_total.total_salary,
    },
    {
      code: "200.01.008",
      indicator: t("common.taxableIncomeLabel"),
      month1: data.month1.taxable_income,
      month2: data.month2.taxable_income,
      month3: data.month3.taxable_income,
      total: data.quarter_total.taxable_income,
      highlight: true,
    },
  ];

  const opvSectionRows = [
    {
      code: "200.01.009",
      indicator: t("common.opvBase"),
      month1: data.month1.accrued_income,
      month2: data.month2.accrued_income,
      month3: data.month3.accrued_income,
      total: data.quarter_total.accrued_income,
    },
    {
      code: "200.01.016",
      indicator: t("common.snBase"),
      month1: data.month1.accrued_income,
      month2: data.month2.accrued_income,
      month3: data.month3.accrued_income,
      total: data.quarter_total.accrued_income,
    },
    {
      code: "200.01.017",
      indicator: t("common.soBase"),
      month1: calculateSocialTaxBase(data.month1.accrued_income, data.month1.opv),
      month2: calculateSocialTaxBase(data.month2.accrued_income, data.month2.opv),
      month3: calculateSocialTaxBase(data.month3.accrued_income, data.month3.opv),
      total: calculateSocialTaxBase(data.quarter_total.accrued_income, data.quarter_total.opv),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-5">
      <div className="flex flex-col gap-4">
        <h3 className="text-body-bold-md content-base-primary">
          {t("common.detailedMonthlyBreakdown")}
        </h3>
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("common.code")}</Table.HeadCell>
              <Table.HeadCell>{t("common.indicator")}</Table.HeadCell>
              <Table.HeadCell align="right">{monthNames[0]}</Table.HeadCell>
              <Table.HeadCell align="right">{monthNames[1]}</Table.HeadCell>
              <Table.HeadCell align="right">{monthNames[2]}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.total")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={6}>
                <p className="text-body-bold-md content-base-primary text-center">
                  {t("common.sectionIpn")}
                </p>
              </Table.Cell>
            </Table.Row>
            {ipnSectionRows.map((row) => (
              <Table.Row key={row.code}>
                <Table.Cell>{row.code}</Table.Cell>
                <Table.Cell className={row.highlight ? "surface-success-fill/30" : undefined}>
                  {row.indicator}
                </Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month1)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month2)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month3)}</Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(row.total)}
                </Table.Cell>
              </Table.Row>
            ))}

            <Table.Row>
              <Table.Cell colSpan={6} className="surface-warning-fill/30">
                <p className="text-body-bold-md content-base-primary text-center">
                  {t("common.sectionOpvSnSo")}
                </p>
              </Table.Cell>
            </Table.Row>
            {opvSectionRows.map((row) => (
              <Table.Row key={row.code}>
                <Table.Cell>{row.code}</Table.Cell>
                <Table.Cell>{row.indicator}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month1)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month2)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month3)}</Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(row.total)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Table>
      </div>
    </div>
  );
}
