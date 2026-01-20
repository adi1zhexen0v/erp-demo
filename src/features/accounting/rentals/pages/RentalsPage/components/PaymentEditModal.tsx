import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { ModalForm, Button, Input, Select, DatePicker } from "@/shared/ui";
import { removeTrailingZeros } from "@/shared/utils";
import { useScrollDetection, useLocale } from "@/shared/hooks";
import { useGetRentalPaymentQuery } from "../../../api";
import type { RentalPaymentUpdateRequest } from "../../../types";
import { buildUpdateRentalPaymentDto } from "../../../utils";

interface Props {
  paymentId: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, dto: RentalPaymentUpdateRequest) => Promise<void>;
  isLoading: boolean;
}

export default function PaymentEditModal({ paymentId, isOpen, onClose, onConfirm, isLoading }: Props) {
  const { t } = useTranslation("RentalsPage");
  const locale = useLocale();
  const { scrollRef, hasScroll } = useScrollDetection();

  const { data: payment } = useGetRentalPaymentQuery(paymentId, { skip: !isOpen });

  const [periodStartDate, setPeriodStartDate] = useState<Date | null>(null);
  const [periodEndDate, setPeriodEndDate] = useState<Date | null>(null);
  const [period, setPeriod] = useState("");
  const [amountTotal, setAmountTotal] = useState("");
  const [vatRate, setVatRate] = useState("0.16");
  const [avrNumber, setAvrNumber] = useState("");
  const [avrDate, setAvrDate] = useState<Date | null>(null);

  useEffect(() => {
    if (payment && isOpen) {
      setPeriodStartDate(payment.period_start_date ? new Date(payment.period_start_date) : null);
      setPeriodEndDate(payment.period_end_date ? new Date(payment.period_end_date) : null);
      setPeriod(payment.period || "");
      setAmountTotal(removeTrailingZeros(payment.amount_total));
      setVatRate(payment.vat_rate);
      setAvrNumber(payment.avr_number);
      setAvrDate(payment.avr_date ? new Date(payment.avr_date) : null);
    }
  }, [payment, isOpen]);

  const vatRateOptions = [
    { label: "16%", value: "0.16" },
    { label: "0%", value: "0" },
  ];

  if (!isOpen || !payment) return null;

  async function handleSubmit() {
    if (isLoading || !periodStartDate || !periodEndDate || !avrDate) {
      return;
    }

    const dto = buildUpdateRentalPaymentDto({
      periodStartDate,
      periodEndDate,
      period,
      amountTotal,
      vatRate,
      avrNumber,
      avrDate,
    });

    await onConfirm(paymentId, dto);
  }

  return (
    <ModalForm icon={null} onClose={onClose} allowCloseInOverlay={false}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 shrink-0 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("modals.edit.title")}</h4>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col h-full">
          <div
            ref={scrollRef}
            className={cn("flex-1 overflow-auto flex flex-col gap-4 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
            <DatePicker
              label={t("modals.edit.periodStart")}
              value={periodStartDate}
              onChange={(date) => setPeriodStartDate(date as Date | null)}
              mode="single"
              locale={locale}
            />

            <DatePicker
              label={t("modals.edit.periodEnd")}
              value={periodEndDate}
              onChange={(date) => setPeriodEndDate(date as Date | null)}
              mode="single"
              locale={locale}
            />

            <Input
              label={t("modals.edit.periodDescription")}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder={t("modals.edit.periodDescriptionPlaceholder")}
            />

            <Input
              label={t("modals.edit.amountTotal")}
              value={amountTotal}
              onChange={(e) => setAmountTotal(e.target.value)}
              placeholder="0.00"
              onlyNumber
            />

            <Select<string>
              options={vatRateOptions}
              label={t("modals.edit.vatRate")}
              value={vatRate}
              onChange={(val) => val !== null && setVatRate(val)}
            />

            <Input
              label={t("modals.edit.avrNumber")}
              value={avrNumber}
              onChange={(e) => setAvrNumber(e.target.value)}
              placeholder={t("modals.edit.avrNumberPlaceholder")}
            />

            <DatePicker
              label={t("modals.edit.avrDate")}
              value={avrDate}
              onChange={(date) => setAvrDate(date as Date | null)}
              mode="single"
              locale={locale}
              direction="top"
            />
          </div>

          <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              {t("modals.edit.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !periodStartDate || !periodEndDate || !avrDate || !amountTotal || !avrNumber}>
              {isLoading ? t("modals.edit.updating") : t("modals.edit.update")}
            </Button>
          </div>
        </form>
      </div>
    </ModalForm>
  );
}
