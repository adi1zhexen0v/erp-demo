import { useTranslation } from "react-i18next";
import { Table } from "@/shared/ui";
import type { Form20000Response } from "@/features/accounting/tax";
import { formatMoneyKzt , getMonthKeysForQuarter, getLocalizedMonthNames } from "@/shared/utils";


interface Props {
  data: Form20000Response;
}

export default function Form20000({ data }: Props) {
  const { t } = useTranslation("TaxPage");
  const monthKeys = getMonthKeysForQuarter(data.quarter);
  const monthNames = getLocalizedMonthNames(monthKeys, t);

  const deductionsRows = [
    {
      code: "200.00.001",
      indicator: t("common.ipnPayable"),
      account: "3120",
      month1: data.month1.ipn,
      month2: data.month2.ipn,
      month3: data.month3.ipn,
      total: data.quarter_total.ipn,
    },
    {
      code: "200.00.002",
      indicator: t("common.opvPayable"),
      account: "3220",
      month1: data.month1.opv,
      month2: data.month2.opv,
      month3: data.month3.opv,
      total: data.quarter_total.opv,
    },
    {
      code: "200.00.011",
      indicator: t("common.vosmsEmployee"),
      account: "3240",
      month1: data.month1.vosms_employee,
      month2: data.month2.vosms_employee,
      month3: data.month3.vosms_employee,
      total: data.quarter_total.vosms_employee,
    },
  ];

  const employerExpensesRows = [
    {
      code: "200.00.005",
      indicator: t("common.socialTax"),
      account: "3150",
      month1: data.month1.sn_payable,
      month2: data.month2.sn_payable,
      month3: data.month3.sn_payable,
      total: data.quarter_total.sn_payable,
    },
    {
      code: "200.00.008",
      indicator: t("common.socialContributionsLabel"),
      account: "3210",
      month1: data.month1.so,
      month2: data.month2.so,
      month3: data.month3.so,
      total: data.quarter_total.so,
    },
    {
      code: "200.00.010",
      indicator: t("common.vosmsEmployer"),
      account: "3213",
      month1: data.month1.vosms_employer,
      month2: data.month2.vosms_employer,
      month3: data.month3.vosms_employer,
      total: data.quarter_total.vosms_employer,
    },
    {
      code: "200.00.013",
      indicator: t("common.opvr"),
      account: "3220",
      month1: data.month1.opvr,
      month2: data.month2.opvr,
      month3: data.month3.opvr,
      total: data.quarter_total.opvr,
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-5">
      <div className="flex flex-col gap-4">
        <h3 className="text-body-bold-md content-base-primary">{t("common.monthlyBreakdown")}</h3>
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("common.code")}</Table.HeadCell>
              <Table.HeadCell>{t("common.indicator")}</Table.HeadCell>
              <Table.HeadCell>{t("common.account")}</Table.HeadCell>
              <Table.HeadCell align="right">{monthNames[0]}</Table.HeadCell>
              <Table.HeadCell align="right">{monthNames[1]}</Table.HeadCell>
              <Table.HeadCell align="right">{monthNames[2]}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.total")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={7}>
                <p className="text-body-bold-md content-base-primary text-center">{t("common.deductionsFromSalary")}</p>
              </Table.Cell>
            </Table.Row>
            {deductionsRows.map((row) => (
              <Table.Row key={row.code}>
                <Table.Cell>{row.code}</Table.Cell>
                <Table.Cell>{row.indicator}</Table.Cell>
                <Table.Cell>{row.account}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month1)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month2)}</Table.Cell>
                <Table.Cell align="right">{formatMoneyKzt(row.month3)}</Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(row.total)}
                </Table.Cell>
              </Table.Row>
            ))}

            <Table.Row>
              <Table.Cell colSpan={7}>
                <p className="text-body-bold-md content-base-primary text-center">{t("common.employerExpenses")}</p>
              </Table.Cell>
            </Table.Row>
            {employerExpensesRows.map((row) => (
              <Table.Row key={row.code}>
                <Table.Cell>{row.code}</Table.Cell>
                <Table.Cell>{row.indicator}</Table.Cell>
                <Table.Cell>{row.account}</Table.Cell>
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
