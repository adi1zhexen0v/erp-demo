import { useTranslation } from "react-i18next";
import { InfoCircle } from "iconsax-react";
import { useLocale } from "@/shared/hooks";
import { Table } from "@/shared/ui";
import type { Form10002Data } from "@/features/accounting/tax";
import { formatMoneyKzt } from "@/shared/utils";
import { formatRate } from "@/features/accounting/tax/utils";

interface Props {
  data: Form10002Data;
}

export default function Form10002({ data }: Props) {
  const { t } = useTranslation("TaxPage");
  const locale = useLocale();

  const groups = [
    {
      ...data.group_i,
      label: `І ${t("common.group")} (${formatRate(data.group_i.depreciation_rate, locale)})`,
    },
    {
      ...data.group_ii,
      label: `ІІ ${t("common.group")} (${formatRate(data.group_ii.depreciation_rate, locale)})`,
    },
    {
      ...data.group_iii,
      label: `III ${t("common.group")} (${formatRate(data.group_iii.depreciation_rate, locale)})`,
    },
    {
      ...data.group_iv,
      label: `IV ${t("common.group")} (${formatRate(data.group_iv.depreciation_rate, locale)})`,
    },
  ];

  const rows = [
    {
      code: "100.02.001",
      label: t("form10002.row001"),
      getValue: (group: (typeof groups)[0]) => group.opening_balance,
    },
    {
      code: "100.02.002",
      label: t("form10002.row002"),
      getValue: (group: (typeof groups)[0]) => group.additions,
    },
    {
      code: "100.02.003",
      label: t("form10002.row003"),
      getValue: (group: (typeof groups)[0]) => group.disposals,
    },
    {
      code: "100.02.006",
      label: t("form10002.row006"),
      getValue: (group: (typeof groups)[0]) => group.depreciation,
    },
    {
      code: "100.02.005",
      label: t("form10002.row005"),
      getValue: (group: (typeof groups)[0]) => group.closing_balance,
    },
    {
      code: "100.02.011",
      label: t("form10002.row011"),
      getValue: (group: (typeof groups)[0]) => group.total_deductions,
      isBold: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-body-bold-md content-base-primary">{t("form10002.title")}</h3>
        <p className="text-body-regular-sm content-action-neutral flex items-center gap-1.5">
          <InfoCircle size={16} color="currentColor" /> {t("form10002.appendix")}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("form10002.row")}</Table.HeadCell>
              <Table.HeadCell>{t("common.indicator")}</Table.HeadCell>
              {groups.map((group) => (
                <Table.HeadCell key={group.group_code} align="right">
                  {group.label}
                </Table.HeadCell>
              ))}
            </tr>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.code}>
                <Table.Cell isBold={row.isBold}>{row.code}</Table.Cell>
                <Table.Cell isBold={row.isBold}>{row.label}</Table.Cell>
                {groups.map((group) => (
                  <Table.Cell key={group.group_code} align="right" isBold={row.isBold}>
                    {formatMoneyKzt(row.getValue(group))}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Table>
      </div>

      <div className="flex items-center justify-between gap-3 p-4 surface-component-fill radius-lg">
        <h3 className="text-body-regular-lg content-base-primary">{t("form10002.totalDeductions")}</h3>
        <p className="text-display-2xs content-base-primary">{formatMoneyKzt(data.total_fixed_asset_deductions)}</p>
      </div>
    </div>
  );
}
