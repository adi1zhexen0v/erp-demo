import { useTranslation } from "react-i18next";
import { DocumentText1, PercentageCircle, Profile2User, ReceiptText, TableDocument } from "iconsax-react";
import { Table } from "@/shared/ui";
import { formatMoneyKzt, toNumber } from "@/shared/utils";
import type { GPHPayment } from "@/features/accounting/payroll";

interface Props {
  payment: GPHPayment;
  isFullScreen?: boolean;
}

interface BalanceEntry {
  account: string;
  nameKey: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  type: "Дт" | "Кт";
}

export default function AccountingTab({ payment, isFullScreen = false }: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  const grossAmount = toNumber(payment.gross_amount);
  const opv = toNumber(payment.opv);
  const ipn = toNumber(payment.ipn);
  const vosms = toNumber(payment.vosms);
  const so = toNumber(payment.so);
  const totalWithheld = toNumber(payment.total_withheld);
  const netAmount = toNumber(payment.net_amount);
  const totalCost = toNumber(payment.total_cost);

  const balanceEntries: BalanceEntry[] = [
    { account: "3120", nameKey: "tabs.accounting.account3120", debit: null, credit: ipn, balance: ipn, type: "Кт" },
    { account: "3211", nameKey: "tabs.accounting.account3211", debit: null, credit: so, balance: so, type: "Кт" },
    { account: "3212", nameKey: "tabs.accounting.account3212", debit: null, credit: vosms, balance: vosms, type: "Кт" },
    { account: "3220", nameKey: "tabs.accounting.account3220", debit: null, credit: opv, balance: opv, type: "Кт" },
    {
      account: "3350",
      nameKey: "tabs.accounting.account3350",
      debit: totalWithheld,
      credit: grossAmount,
      balance: netAmount,
      type: "Кт",
    },
    {
      account: "7210",
      nameKey: "tabs.accounting.account7210",
      debit: totalCost,
      credit: null,
      balance: totalCost,
      type: "Дт",
    },
  ];

  const totalDebit = balanceEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = balanceEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <ReceiptText size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.accounting.balanceSheet")}</span>
      </div>

      <div className="overflow-x-auto page-scroll pb-2">
        <Table.Table>
          <Table.Header>
            <Table.Row>
              <Table.HeadCell>{t("tabs.accounting.account")}</Table.HeadCell>
              <Table.HeadCell>{t("tabs.accounting.accountName")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("tabs.accounting.debit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("tabs.accounting.credit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("tabs.accounting.finalBalance")}</Table.HeadCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {balanceEntries.map((be) => (
              <Table.Row key={be.account}>
                <Table.Cell>{be.account}</Table.Cell>
                <Table.Cell isBold>{t(be.nameKey)}</Table.Cell>
                <Table.Cell align="right" isBold>
                  {be.debit ? formatMoneyKzt(be.debit) : "−"}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {be.credit ? formatMoneyKzt(be.credit) : "−"}
                </Table.Cell>
                <Table.Cell align="right" isBold>
                  {formatMoneyKzt(be.balance)}
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell colSpan={2} align="right" isBold>
                {t("tabs.accounting.total")}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalDebit)}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(totalCredit)}
              </Table.Cell>
              <Table.Cell align="right" isBold>
                −
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>

      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <TableDocument size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("tabs.accounting.paymentSummary")}</span>
      </div>

      <div className={`grid gap-3 ${isFullScreen ? "grid-cols-3" : "grid-cols-1"}`}>
        <div className="p-5 radius-lg border surface-base-stroke flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
                <span className="content-action-neutral">
                  <Profile2User size={16} color="currentColor" />
                </span>
              </div>
              <span className="text-body-bold-lg content-base-primary">
                {t("tabs.gph.contractor")} {payment.contractor_name}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.accrued")}</span>
                <p className="text-body-bold-md content-action-positive">+ {formatMoneyKzt(grossAmount, locale)}</p>
              </div>

              <div className="border-t surface-base-stroke"></div>

              <div className="flex justify-between items-start">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.deductions")}</span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-body-bold-md content-base-primary text-right">{t("tabs.accounting.opvPercent")}</p>
                  <p className="text-body-bold-md content-base-primary text-right">{t("tabs.accounting.ipnPercent")}</p>
                  <p className="text-body-bold-md content-base-primary text-right">{t("tabs.accounting.vosmsPercent")}</p>
                </div>
              </div>

              <div className="border-t surface-base-stroke"></div>

              <div className="flex justify-between items-center">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.totalDeductedAmount")}</span>
                <p className="text-body-bold-md content-action-negative">- {formatMoneyKzt(totalWithheld, locale)}</p>
              </div>
            </div>
          </div>

          <div className="radius-sm p-3 surface-component-fill flex justify-between items-center">
            <span className="text-body-regular-sm content-base-primary">{t("tabs.accounting.toPay")}</span>
            <span className="text-display-2xs content-base-primary">{formatMoneyKzt(netAmount, locale)}</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke flex flex-col gap-5 justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
                <span className="content-action-neutral">
                  <PercentageCircle size={16} color="currentColor" />
                </span>
              </div>
              <span className="text-body-bold-lg content-base-primary">{t("tabs.accounting.employerTaxes")}</span>
            </div>

            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between py-2 border-b surface-base-stroke">
                <span className="text-label-xs content-action-neutral">{t("tabs.accounting.soPercent")}</span>
                <span className="text-body-bold-md content-base-primary">{formatMoneyKzt(so, locale)}</span>
              </div>
            </div>
          </div>

          <div className="radius-sm p-3 surface-component-fill flex justify-between items-center">
            <span className="text-body-regular-sm content-base-primary">{t("tabs.accounting.totalEmployer")}</span>
            <span className="text-display-2xs content-base-primary">{formatMoneyKzt(so, locale)}</span>
          </div>
        </div>

        <div className="p-5 radius-lg border surface-base-stroke flex flex-col gap-5 justify-between bg-primary-500">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-start gap-3">
              <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
                <span className="content-action-neutral">
                  <DocumentText1 size={16} color="currentColor" />
                </span>
              </div>
              <span className="text-body-bold-lg text-white">{t("tabs.accounting.finalSummary")}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between py-2 border-b border-white/20">
                <span className="text-label-xs text-white">{t("tabs.gph.accruedToContractor")}</span>
                <span className="text-body-bold-md text-white">{formatMoneyKzt(grossAmount, locale)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/20">
                <span className="text-label-xs text-white">{t("tabs.accounting.paid")}</span>
                <span className="text-body-bold-md text-white">{formatMoneyKzt(netAmount, locale)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-label-xs text-white">{t("tabs.accounting.totalTaxesAndContributions")}</span>
                <span className="text-body-bold-md text-white">{formatMoneyKzt(totalWithheld + so, locale)}</span>
              </div>
            </div>
          </div>

          <div className="radius-sm p-3 bg-white flex justify-between items-center">
            <span className="text-body-regular-sm text-black">{t("tabs.accounting.fullEmployerCost")}</span>
            <span className="text-display-2xs text-black">{formatMoneyKzt(totalCost, locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

