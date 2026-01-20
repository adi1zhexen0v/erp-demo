import { useTranslation } from "react-i18next";
import { Table } from "@/shared/ui";
import type { Form20005Response } from "@/features/accounting/tax";
import { formatMoneyKzt , getMonthKeysForQuarter, getLocalizedMonthNames } from "@/shared/utils";


interface Props {
  data: Form20005Response;
}

export default function Form20005({ data }: Props) {
  const { t } = useTranslation("TaxPage");
  const monthKeys = getMonthKeysForQuarter(data.quarter);
  const monthNames = getLocalizedMonthNames(monthKeys, t);

  const months = [data.month1, data.month2, data.month3];

  return (
    <div className="flex flex-col gap-6 mt-5">
      {months.map((monthData, idx) => (
        <div key={monthData.month} className="flex flex-col gap-4">
          <h3 className="text-body-bold-md content-base-primary">{monthNames[idx]}</h3>
          <Table.Table>
            <Table.Header>
              <tr>
                <Table.HeadCell>№</Table.HeadCell>
                <Table.HeadCell>{t("common.fullName")}</Table.HeadCell>
                <Table.HeadCell>{t("common.status")}</Table.HeadCell>
                <Table.HeadCell>{t("common.category")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.accrued")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.opv")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.vosmsEmployeeShort")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.deduction")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.ipn")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.sn")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.so")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.snPayable")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.vosmsEmployerShort")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.opvr")}</Table.HeadCell>
              </tr>
            </Table.Header>
            <Table.Body>
              {monthData.entries.map((entry) => (
                <Table.Row key={`${entry.iin}-${entry.month}-${entry.row_number}`}>
                  <Table.Cell>{entry.row_number}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="text-body-bold-sm content-base-primary">{entry.full_name}</p>
                      <p className="text-label-xs content-action-neutral">{entry.iin}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {t(`employeeStatus.${entry.status_code}`) || entry.status_code}
                  </Table.Cell>
                  <Table.Cell>
                    {t(`employeeCategory.${entry.category_code}`) || entry.category_code}
                  </Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.accrued_income, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.opv_amount, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.vosms_employee_amount, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.standard_deduction, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.ipn_calculated, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.sn_calculated, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.so_amount, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.sn_payable, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.vosms_employer_amount, undefined, false)}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(entry.opvr_amount, undefined, false)}</Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell colSpan={4} isBold>
                  {t("common.total")}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_accrued_income, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_opv, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_vosms_employee, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_standard_deduction, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_ipn, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_sn, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_so, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_sn_payable, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_vosms_employer, undefined, false)}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(monthData.total_opvr, undefined, false)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Table>
        </div>
      ))}
    </div>
  );
}
