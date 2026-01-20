import { useTranslation } from "react-i18next";
import { TableDocument } from "iconsax-react";
import { Table } from "@/shared/ui";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import type { GroupedPurchase } from "../../../types";
import { CATEGORY_LABELS } from "../../../consts";
import { calculateNetAmount, calculateVatAmount, DEFAULT_VAT_RATE } from "../../../utils";

interface Props {
  purchase: GroupedPurchase;
  isFullScreen: boolean;
}

interface BalanceEntry {
  account: string;
  nameKey: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

export default function PurchaseAccountingSection({ purchase, isFullScreen: _isFullScreen }: Props) {
  const { t, i18n } = useTranslation("PurchasesPage");
  const locale = (i18n.language as "ru" | "en" | "kk") || "ru";

  const totalAmount = toNumber(purchase.total_amount);
  const vatRate = DEFAULT_VAT_RATE;
  const netAmount = calculateNetAmount(totalAmount, vatRate);
  const vatAmount = calculateVatAmount(totalAmount, vatRate);

  const categoryAccount = purchase.category === "mixed" ? "1330" : purchase.category;
  const categoryName =
    purchase.category === "mixed"
      ? t("category.mixed")
      : CATEGORY_LABELS[purchase.category]?.[locale] || purchase.category;

  const balanceEntries: BalanceEntry[] = [
    {
      account: categoryAccount,
      nameKey: categoryName,
      debit: netAmount,
      credit: null,
      balance: netAmount,
    },
    {
      account: "1420",
      nameKey: t("detail.accounting.vatReceivable"),
      debit: vatAmount,
      credit: null,
      balance: vatAmount,
    },
    {
      account: "3310",
      nameKey: t("detail.accounting.payables"),
      debit: null,
      credit: totalAmount,
      balance: totalAmount,
    },
  ];

  const totalDebit = balanceEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
  const totalCredit = balanceEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-start gap-3 pb-3 border-b surface-base-stroke">
        <div className="w-8 aspect-square radius-xs surface-component-fill flex items-center justify-center">
          <span className="content-action-neutral">
            <TableDocument size={16} color="currentColor" />
          </span>
        </div>
        <span className="text-body-bold-lg content-base-primary">{t("detail.accounting.trialBalance")}</span>
      </div>

      <div className="overflow-x-auto page-scroll pb-2">
        <Table.Table>
          <Table.Header>
            <Table.Row>
              <Table.HeadCell>{t("detail.accounting.account")}</Table.HeadCell>
              <Table.HeadCell>{t("detail.accounting.accountName")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("detail.accounting.debit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("detail.accounting.credit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("detail.accounting.finalBalance")}</Table.HeadCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {balanceEntries.map((be) => (
              <Table.Row key={be.account}>
                <Table.Cell>{be.account}</Table.Cell>
                <Table.Cell isBold>{be.nameKey}</Table.Cell>
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
                {t("detail.accounting.total")}
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
    </div>
  );
}
