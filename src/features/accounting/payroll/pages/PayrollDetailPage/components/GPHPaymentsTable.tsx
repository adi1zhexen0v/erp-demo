import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Eye, TickCircle, Clock, Wallet } from "iconsax-react";
import { Table, Button, Badge } from "@/shared/ui";
import { CheckIcon } from "@/shared/assets/icons";
import { formatMoneyKzt } from "@/shared/utils";
import type { GPHPayment, GPHPaymentStatus } from "@/features/accounting/payroll";
import { getInitials } from "@/features/accounting/payroll";

interface Props {
  payments: GPHPayment[];
  onViewDetails: (payment: GPHPayment) => void;
  onApprove?: (payment: GPHPayment) => void;
  onMarkPaid?: (payment: GPHPayment) => void;
  approvingGPHId?: number | null;
  markingGPHPaidId?: number | null;
}

function getStatusBadgeConfig(status: GPHPaymentStatus, t: (key: string) => string) {
  switch (status) {
    case "paid":
      return {
        color: "positive" as const,
        text: t("detail.gphPayments.statusPaid"),
        icon: <TickCircle size={16} color="currentColor" variant="Bold" />,
      };
    case "approved":
      return {
        color: "positive" as const,
        text: t("detail.gphPayments.statusApproved"),
        icon: <TickCircle size={16} color="currentColor" />,
      };
    case "pending":
    default:
      return {
        color: "notice" as const,
        text: t("detail.gphPayments.statusPending"),
        icon: <Clock size={16} color="currentColor" />,
      };
  }
}

export default function GPHPaymentsTable({
  payments,
  onViewDetails,
  onApprove,
  onMarkPaid,
  approvingGPHId,
  markingGPHPaidId,
}: Props) {
  const { t, i18n } = useTranslation("PayrollPage");
  const locale = (i18n.language as "ru" | "kk" | "en") || "ru";

  if (payments.length === 0) {
    return (
      <div className="p-5 rounded-lg border surface-base-stroke text-center">
        <p className="text-body-regular-sm content-action-neutral">{t("detail.gphPayments.empty")}</p>
      </div>
    );
  }

  return (
    <Table.Table>
      <Table.Header>
        <tr>
          <Table.HeadCell>{t("detail.gphPayments.contractor")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.completionAct")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.gross")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.withheld")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.net")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.totalCost")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.status")}</Table.HeadCell>
          <Table.HeadCell>{t("detail.gphPayments.actions")}</Table.HeadCell>
        </tr>
      </Table.Header>
      <Table.Body>
        {payments.map((payment, index) => {
          const isPending = payment.status === "pending";
          const isApproved = payment.status === "approved";
          const isEven = index % 2 === 0;
          const avatarBg = isEven ? "bg-grey-50 dark:bg-grey-900" : "bg-white dark:bg-grey-950";
          const badgeConfig = getStatusBadgeConfig(payment.status, t);

          return (
            <Table.Row key={payment.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 aspect-square rounded-full flex items-center justify-center shrink-0",
                      avatarBg,
                    )}>
                    <span className="content-action-brand text-body-bold-xs">
                      {getInitials(payment.contractor_name)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-body-bold-sm content-base-primary">{payment.contractor_name}</p>
                      <p className="text-label-xs content-action-neutral">{payment.contractor_iin}</p>
                    </div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div>
                  <p className="text-body-regular-sm content-base-primary">{payment.completion_act.display_number}</p>
                  <p className="text-label-xs content-action-neutral truncate max-w-[200px]">
                    {payment.completion_act.service_name}
                  </p>
                </div>
              </Table.Cell>
              <Table.Cell>{formatMoneyKzt(payment.gross_amount, locale)}</Table.Cell>
              <Table.Cell>{formatMoneyKzt(payment.total_withheld, locale)}</Table.Cell>
              <Table.Cell isBold>{formatMoneyKzt(payment.net_amount, locale)}</Table.Cell>
              <Table.Cell>{formatMoneyKzt(payment.total_cost, locale)}</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color={badgeConfig.color} text={badgeConfig.text} icon={badgeConfig.icon} />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    isIconButton
                    onClick={() => onViewDetails(payment)}
                    className="w-8! radius-xs! p-0!"
                    title={t("actions.viewDetails")}>
                    <Eye size={16} color="currentColor" />
                  </Button>
                  {isPending && onApprove && (
                    <Button
                      variant="primary"
                      isIconButton
                      onClick={() => onApprove(payment)}
                      disabled={approvingGPHId === payment.id}
                      className="w-8! radius-xs! p-0!"
                      title={t("actions.approve")}>
                      <CheckIcon />
                    </Button>
                  )}
                  {isApproved && onMarkPaid && (
                    <Button
                      variant="primary"
                      isIconButton
                      onClick={() => onMarkPaid(payment)}
                      disabled={markingGPHPaidId === payment.id}
                      className="w-8! radius-xs! p-0!"
                      title={t("actions.markPaid")}>
                      <Wallet size={16} color="currentColor" />
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Table>
  );
}
