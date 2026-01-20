import { useTranslation } from "react-i18next";
import { useLocale } from "@/shared/hooks";
import { Table } from "@/shared/ui";
import type { Form100Data } from "@/features/accounting/tax";
import { formatMoneyKzt } from "@/shared/utils";
import { formatRate } from "@/features/accounting/tax/utils";


interface Props {
  data: Form100Data;
}

export default function Form10000({ data }: Props) {
  const { t } = useTranslation("TaxPage");
  const locale = useLocale();

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 mt-5">
      <div className="flex flex-col gap-4">
        <h3 className="text-body-bold-md content-base-primary">{t("common.income")}</h3>
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("common.name")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{t("common.salesRevenue")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.sales_revenue)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.interestIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.interest_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.royaltyIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.royalty_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.rentalIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.rental_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.assetDisposalGain")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.asset_disposal_gain)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.grantIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.grant_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.foreignExchangeGain")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.foreign_exchange_gain)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.otherIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.income.other_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell isBold>{t("common.totalGrossIncome")}</Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(data.income.total_gross_income)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-bold-md content-base-primary">{t("common.deductions")}</h3>
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("common.name")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{t("common.costOfSales")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.cost_of_sales)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.laborCosts")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.labor_costs)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.socialContributions")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.social_contributions)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.interestExpense")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.interest_expense)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.fixedAssetDeductions")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.fixed_asset_deductions)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.taxesAndDuties")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.taxes_and_duties)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.depreciation")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.depreciation)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.adminExpenses")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.admin_expenses)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.otherExpenses")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.deductions.other_expenses)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell isBold>{t("common.totalDeductions")}</Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(data.deductions.total_deductions)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-bold-md content-base-primary">{t("common.taxCalculation")}</h3>
        <Table.Table>
          <Table.Header>
            <tr>
              <Table.HeadCell>{t("common.indicator")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
            </tr>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{t("common.taxableIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.taxable_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.exemptIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.exempt_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.totalTaxableIncome")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.total_taxable_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.lossCarryforward")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.loss_carryforward)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.withLosses")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.adjusted_taxable_income)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.citRate")}</Table.Cell>
              <Table.Cell align="right">{formatRate(data.tax_calculation.cit_rate, locale)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.citCalculated")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.cit_calculated)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t("common.foreignTaxCredit")}</Table.Cell>
              <Table.Cell align="right">{formatMoneyKzt(data.tax_calculation.foreign_tax_credit)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell isBold>{t("common.citPayable")}</Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(data.tax_calculation.cit_payable)}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell isBold>{t("common.totalCit")}</Table.Cell>
              <Table.Cell align="right" isBold>
                {formatMoneyKzt(data.tax_calculation.total_cit)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </div>

      {data.income_accounts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-body-bold-md content-base-primary">
            {t("common.accountDetails")}
          </h3>
          <Table.Table>
            <Table.Header>
              <tr>
                <Table.HeadCell>{t("common.account")}</Table.HeadCell>
                <Table.HeadCell>{t("common.name")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
              </tr>
            </Table.Header>
            <Table.Body>
              {data.income_accounts.map((account) => (
                <Table.Row key={account.code}>
                  <Table.Cell>{account.code}</Table.Cell>
                  <Table.Cell>{account.name}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(account.amount)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
        </div>
      )}

      {data.expense_accounts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-body-bold-md content-base-primary">
            {t("common.expenseAccountDetails")}
          </h3>
          <Table.Table>
            <Table.Header>
              <tr>
                <Table.HeadCell>{t("common.account")}</Table.HeadCell>
                <Table.HeadCell>{t("common.name")}</Table.HeadCell>
                <Table.HeadCell align="right">{t("common.amount")}</Table.HeadCell>
              </tr>
            </Table.Header>
            <Table.Body>
              {data.expense_accounts.map((account) => (
                <Table.Row key={account.code}>
                  <Table.Cell>{account.code}</Table.Cell>
                  <Table.Cell>{account.name}</Table.Cell>
                  <Table.Cell align="right">{formatMoneyKzt(account.amount)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
        </div>
      )}
    </div>
  );
}
