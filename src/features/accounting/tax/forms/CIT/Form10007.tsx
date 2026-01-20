import { useTranslation } from "react-i18next";
import { InfoCircle } from "iconsax-react";
import { Table } from "@/shared/ui";
import type { Form10007Data } from "@/features/accounting/tax";
import { formatMoneyKzt , toNumber } from "@/shared/utils";


interface Props {
  data: Form10007Data;
}

export default function Form10007({ data }: Props) {
  const { t } = useTranslation("TaxPage");

  const assetsRows = [
    { code: "100.07.001", name: t("common.cash"), value: data.assets.cash },
    { code: "100.07.004", name: t("common.inventory"), value: data.assets.inventory },
    { code: "100.07.005", name: t("common.vatReceivable"), value: data.assets.vat_receivable },
    { code: "100.07.012", name: t("common.fixedAssets"), value: data.assets.fixed_assets_net },
    { code: "100.07.015", name: t("common.intangibles"), value: data.assets.intangibles_net },
    {
      code: "100.07.018",
      name: t("common.totalAssets"),
      value: data.assets.total_assets,
      isBold: true,
    },
  ];

  const liabilitiesRows = [
    {
      code: "100.07.020",
      name: t("common.taxLiabilities"),
      value: data.liabilities.tax_liabilities,
    },
    {
      code: "100.07.021",
      name: t("common.socialLiabilities"),
      value: data.liabilities.social_liabilities,
    },
    {
      code: "100.07.022",
      name: t("common.accountsPayable"),
      value: data.liabilities.accounts_payable,
    },
    {
      code: "100.07.030",
      name: t("common.totalLiabilities"),
      value: data.liabilities.total_liabilities,
      isBold: true,
    },
  ];

  const equityRows = [
    { code: "100.07.031", name: t("common.charterCapital"), value: data.equity.charter_capital },
    {
      code: "100.07.036",
      name: t("common.retainedEarnings"),
      value: data.equity.retained_earnings,
    },
    {
      code: "100.07.038",
      name: t("common.totalEquity"),
      value: data.equity.total_equity,
      isBold: true,
    },
  ];

  const totalLiabilities = toNumber(data.liabilities.total_liabilities);
  const totalEquity = toNumber(data.equity.total_equity);
  const totalAssets = toNumber(data.assets.total_assets);

  return (
    <div className="flex flex-col gap-6 mt-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-body-bold-md content-base-primary">{t("form10007.title")}</h3>
        <p className="text-body-regular-sm content-action-neutral flex items-center gap-1.5">
          <InfoCircle size={16} color="currentColor" /> {t("form10007.appendix")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-4">
          <h3 className="text-body-bold-md content-base-primary">{t("common.assets")}</h3>
          <Table.Table>
            <Table.Header>
              <tr>
                <Table.HeadCell>{t("form10007.code")}</Table.HeadCell>
                <Table.HeadCell>{t("form10007.name")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("form10007.atBeginning")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("form10007.atEnd")}</Table.HeadCell>
              </tr>
            </Table.Header>
            <Table.Body>
              {assetsRows.map((row) => (
                <Table.Row key={row.code}>
                  <Table.Cell isBold={row.isBold}>{row.code}</Table.Cell>
                  <Table.Cell isBold={row.isBold}>{row.name}</Table.Cell>
                  <Table.Cell align="right" isBold={row.isBold}>
                    {formatMoneyKzt("0")}
                  </Table.Cell>
                  <Table.Cell align="right" isBold={row.isBold}>
                    {formatMoneyKzt(row.value)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-body-bold-md content-base-primary">{t("common.liabilities")}</h3>
            <Table.Table>
              <Table.Header>
                <tr>
                  <Table.HeadCell>{t("form10007.code")}</Table.HeadCell>
                  <Table.HeadCell>{t("form10007.name")}</Table.HeadCell>
                  <Table.HeadCell align="right">{t("form10007.atBeginning")}</Table.HeadCell>
                  <Table.HeadCell align="right">{t("form10007.atEnd")}</Table.HeadCell>
                </tr>
              </Table.Header>
              <Table.Body>
                {liabilitiesRows.map((row) => (
                  <Table.Row key={row.code}>
                    <Table.Cell isBold={row.isBold}>{row.code}</Table.Cell>
                    <Table.Cell isBold={row.isBold}>{row.name}</Table.Cell>
                    <Table.Cell align="right" isBold={row.isBold}>
                      {formatMoneyKzt("0")}
                    </Table.Cell>
                    <Table.Cell align="right" isBold={row.isBold}>
                      {formatMoneyKzt(row.value)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Table>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-body-bold-md content-base-primary">{t("common.equity")}</h3>
            <Table.Table>
              <Table.Header>
                <tr>
                  <Table.HeadCell>{t("form10007.code")}</Table.HeadCell>
                  <Table.HeadCell>{t("form10007.name")}</Table.HeadCell>
                  <Table.HeadCell align="right">{t("form10007.atBeginning")}</Table.HeadCell>
                  <Table.HeadCell align="right">{t("form10007.atEnd")}</Table.HeadCell>
                </tr>
              </Table.Header>
              <Table.Body>
                {equityRows.map((row) => (
                  <Table.Row key={row.code}>
                    <Table.Cell isBold={row.isBold}>{row.code}</Table.Cell>
                    <Table.Cell isBold={row.isBold}>{row.name}</Table.Cell>
                    <Table.Cell align="right" isBold={row.isBold}>
                      {formatMoneyKzt("0")}
                    </Table.Cell>
                    <Table.Cell align="right" isBold={row.isBold}>
                      {formatMoneyKzt(row.value)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4 surface-component-fill radius-lg">
        <h3 className="text-body-regular-lg content-base-primary">{t("form10007.controlRatio")}</h3>
        <div className="flex flex-col gap-1">
          <p className="text-body-regular-md content-action-neutral text-right">{t("form10007.controlFormula")}:</p>
          <p className="text-display-2xs content-base-primary">
            {formatMoneyKzt(totalLiabilities.toString(), undefined, false)} + {formatMoneyKzt(totalEquity.toString(), undefined, false)} ={" "}
            {formatMoneyKzt(totalAssets.toString(), undefined, false)}
          </p>
        </div>
      </div>
    </div>
  );
}
