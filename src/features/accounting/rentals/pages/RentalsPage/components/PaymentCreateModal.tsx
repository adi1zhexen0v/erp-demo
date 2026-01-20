import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DocumentUpload } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Input, Select, ButtonGroup, Prompt, DatePicker, Toast } from "@/shared/ui";
import { FileUploader } from "@/shared/components";
import { CALENDAR_LOCALE } from "@/shared/ui/DatePicker/locale";
import { useScrollDetection, useLocale } from "@/shared/hooks";
import { removeTrailingZeros, extractErrorMessage, formatDateForDisplay } from "@/shared/utils";
import { useGetAllLegalDocumentsQuery } from "@/features/legal/api";
import { useCreateVendorMutation } from "@/features/accounting/warehouse/api";
import type { CreateVendorDto } from "@/features/accounting/warehouse/types";
import type { RentalPaymentCreateRequest, RentalType, RentalPaymentOCRResponse } from "../../../types";
import {
  getYearOptions,
  getMonthPeriodData,
  validateAvrDate as validateAvrDateUtil,
  buildCreateRentalPaymentDto,
} from "../../../utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: RentalPaymentCreateRequest) => Promise<void>;
  onExtractOCR: (file: File) => Promise<RentalPaymentOCRResponse>;
  isLoading: boolean;
  isExtractingOCR: boolean;
  preselectedContractId?: number;
  preselectedType?: RentalType;
}

export default function PaymentCreateModal({
  isOpen: _isOpen,
  onClose,
  onConfirm,
  onExtractOCR,
  isLoading,
  isExtractingOCR,
  preselectedContractId,
  preselectedType,
}: Props) {
  const { t } = useTranslation("RentalsPage");
  const locale = useLocale();
  const { scrollRef, hasScroll } = useScrollDetection();

  const { data: legalDocuments } = useGetAllLegalDocumentsQuery();
  const [createVendor, { isLoading: isCreatingVendor }] = useCreateVendorMutation();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const [file, setFile] = useState<File | null>(null);
  const [rentalType, setRentalType] = useState<RentalType>(preselectedType || "vehicle");
  const [vehicleRentalId, setVehicleRentalId] = useState<number | undefined>(
    preselectedType === "vehicle" && preselectedContractId ? preselectedContractId : undefined,
  );
  const [premisesLeaseId, setPremisesLeaseId] = useState<number | undefined>(
    preselectedType === "premises" && preselectedContractId ? preselectedContractId : undefined,
  );
  const [vendorName, setVendorName] = useState("");
  const [vendorBin, setVendorBin] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [description, setDescription] = useState("");
  const [amountTotal, setAmountTotal] = useState("");
  const [vatRate, setVatRate] = useState("0.16");
  const [avrNumber, setAvrNumber] = useState("");
  const [avrDate, setAvrDate] = useState<Date | null>(null);
  const [avrDateError, setAvrDateError] = useState<string | null>(null);
  const [showOCRSuccess, setShowOCRSuccess] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendorError, setVendorError] = useState<{ title: string; text: string } | null>(null);

  const periodData = useMemo(() => {
    return getMonthPeriodData(selectedYear, selectedMonth, locale);
  }, [selectedMonth, selectedYear, locale]);

  const validateAvrDate = useCallback(
    (date: Date | null): string | null => {
      if (!date) return null;
      const isValid = validateAvrDateUtil(date, periodData.period_start_date);
      return isValid ? null : t("modals.create.avrDateError");
    },
    [periodData.period_start_date, t],
  );

  const handleExtractOCR = useCallback(async () => {
    if (!file) return;
    try {
      const result = await onExtractOCR(file);
      if (result.error) {
        return;
      }
      if (result.vendor_name) {
        setVendorName(result.vendor_name);
      }
      if (result.vendor_bin) {
        setVendorBin(result.vendor_bin);
      }
      if (result.act_number) {
        setAvrNumber(result.act_number);
      }
      if (result.act_date) {
        const ocrDate = new Date(result.act_date);
        setAvrDate(ocrDate);
        const error = validateAvrDate(ocrDate);
        setAvrDateError(error);
      }
      if (result.amount_total) {
        setAmountTotal(removeTrailingZeros(result.amount_total));
      }
      if (result.description) {
        setDescription(result.description);
      }
      setOcrCompleted(true);
    } catch {
      // OCR extraction failed silently - user can still fill form manually
    }
  }, [file, onExtractOCR, validateAvrDate]);

  useEffect(() => {
    if (file && !isExtractingOCR) {
      handleExtractOCR();
    }
  }, [file, isExtractingOCR, handleExtractOCR]);

  useEffect(() => {
    if (!isExtractingOCR && ocrCompleted) {
      setShowOCRSuccess(true);
      setOcrCompleted(false);
      const timer = setTimeout(() => {
        setShowOCRSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isExtractingOCR, ocrCompleted]);

  const vehicleRentalOptions = useMemo(() => {
    if (!legalDocuments) return [];
    return legalDocuments.vehicle_rentals
      .filter((contract) => contract.trustme_status === 3)
      .map((contract) => ({
        label: t("contracts.vehicleFormat", {
          id: contract.id,
          details: `${contract.car_brand} ${contract.car_year}`,
        }),
        value: contract.id,
      }));
  }, [legalDocuments, t]);

  const premisesLeaseOptions = useMemo(() => {
    if (!legalDocuments) return [];
    return legalDocuments.premises_leases
      .filter((contract) => contract.trustme_status === 3)
      .map((contract) => ({
        label: t("contracts.premisesFormat", {
          id: contract.id,
          details: contract.premise_address,
        }),
        value: contract.id,
      }));
  }, [legalDocuments, t]);

  const hasVehicleContracts = vehicleRentalOptions.length > 0;
  const hasPremisesContracts = premisesLeaseOptions.length > 0;
  const hasContracts = rentalType === "vehicle" ? hasVehicleContracts : hasPremisesContracts;
  const showNoContractsToast = !hasContracts;

  const selectedContract = useMemo(() => {
    if (!legalDocuments) return null;

    if (rentalType === "vehicle" && vehicleRentalId) {
      return legalDocuments.vehicle_rentals.find((c) => c.id === vehicleRentalId) || null;
    }

    if (rentalType === "premises" && premisesLeaseId) {
      return legalDocuments.premises_leases.find((c) => c.id === premisesLeaseId) || null;
    }

    return null;
  }, [legalDocuments, rentalType, vehicleRentalId, premisesLeaseId]);

  useEffect(() => {
    if (selectedContract?.commercial_org) {
      const org = selectedContract.commercial_org;
      setVendorName(locale === "kk" ? org.name_kk : org.name_ru);
      setVendorBin(org.bin);
    }
  }, [selectedContract, locale]);

  useEffect(() => {
    if (avrDate) {
      const error = validateAvrDate(avrDate);
      setAvrDateError(error);
    } else {
      setAvrDateError(null);
    }
  }, [selectedMonth, selectedYear, avrDate, validateAvrDate]);

  const contractOptions = useMemo(() => {
    return rentalType === "vehicle" ? vehicleRentalOptions : premisesLeaseOptions;
  }, [rentalType, vehicleRentalOptions, premisesLeaseOptions]);

  const selectedContractId = rentalType === "vehicle" ? vehicleRentalId : premisesLeaseId;

  function handleContractChange(value: number | null) {
    const contractId = value ?? undefined;
    if (rentalType === "vehicle") {
      setVehicleRentalId(contractId);
    } else {
      setPremisesLeaseId(contractId);
    }
  }

  const isContractSelected = Boolean(selectedContractId);

  const monthOptions = useMemo(() => {
    const monthNames = CALENDAR_LOCALE[locale].months;
    return monthNames.map((monthName, index) => ({
      label: monthName,
      value: index,
    }));
  }, [locale]);

  const yearOptions = useMemo(() => {
    return getYearOptions();
  }, []);

  const rentalTypeOptions = [
    { label: t("modals.create.type.vehicle"), value: "vehicle" },
    { label: t("modals.create.type.premises"), value: "premises" },
  ];

  const vatRateOptions = [
    { label: "16%", value: "0.16" },
    { label: "0%", value: "0" },
  ];

  function handleAvrDateChange(date: Date | null) {
    setAvrDate(date);
    const error = validateAvrDate(date);
    setAvrDateError(error);
  }

  async function handleSubmit() {
    if (isLoading || isCreatingVendor || isSubmitting || !avrDate || !amountTotal || !avrNumber) {
      return;
    }

    setIsSubmitting(true);

    try {
      let vendorId: number | undefined = undefined;

      if (vendorName.trim()) {
        if (isCreatingVendor) return;
        try {
          const vendorDto: CreateVendorDto = {
            name: vendorName.trim(),
            bin: vendorBin.trim() || undefined,
          };
          const vendorResponse = await createVendor(vendorDto).unwrap();
          vendorId = vendorResponse.id;
        } catch (err: unknown) {
          setVendorError({
            title: t("messages.errorTitle"),
            text: extractErrorMessage(err, "modals.create.vendorCreationFailed", t),
          });
        }
      }

      const dto = buildCreateRentalPaymentDto({
        rentalType,
        vehicleRentalId,
        premisesLeaseId,
        vendorId,
        periodData,
        description,
        amountTotal,
        avrNumber,
        avrDate,
      });

      await onConfirm(dto);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRentalTypeChange(value: string) {
    setRentalType(value as RentalType);
    setVehicleRentalId(undefined);
    setPremisesLeaseId(undefined);
    setVendorName("");
    setVendorBin("");
  }

  function handleClose() {
    setFile(null);
    setRentalType(preselectedType || "vehicle");
    setVehicleRentalId(preselectedType === "vehicle" && preselectedContractId ? preselectedContractId : undefined);
    setPremisesLeaseId(preselectedType === "premises" && preselectedContractId ? preselectedContractId : undefined);
    setVendorName("");
    setVendorBin("");
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setDescription("");
    setAmountTotal("");
    setVatRate("0.16");
    setAvrNumber("");
    setAvrDate(null);
    setAvrDateError(null);
    setShowOCRSuccess(false);
    setOcrCompleted(false);
    setIsSubmitting(false);
    setVendorError(null);
    onClose();
  }

  return (
    <>
      {isExtractingOCR && (
        <Prompt
          loaderMode={true}
          onClose={() => {}}
          title=""
          text=""
          loaderText={t("messages.loader.extractingOCR.text")}
          additionalText={t("messages.loader.extractingOCR.additionalText")}
          namespace="RentalsPage"
        />
      )}

      {showOCRSuccess && !isExtractingOCR && (
        <Prompt
          title={t("messages.createSuccessTitle")}
          text={t("modals.create.ocrSuccess")}
          variant="success"
          onClose={() => setShowOCRSuccess(false)}
          namespace="RentalsPage"
        />
      )}

      {vendorError && (
        <Prompt
          title={vendorError.title}
          text={vendorError.text}
          variant="warning"
          onClose={() => setVendorError(null)}
          namespace="RentalsPage"
        />
      )}

      <ModalForm icon={DocumentUpload} onClose={handleClose} allowCloseInOverlay={false}>
        <div className="flex flex-col h-full">
          <h4 className="text-display-2xs content-base-primary shrink-0 pb-5 border-b surface-base-stroke">
            {t("modals.create.title")}
          </h4>

          <div
            ref={scrollRef}
            className={cn("flex-1 overflow-auto flex flex-col gap-4 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
            <div className="flex flex-col gap-2 shrink-0">
              <label className="text-label-md content-base-primary">{t("modals.create.type.label")}</label>
              <ButtonGroup options={rentalTypeOptions} value={rentalType} onChange={handleRentalTypeChange} fullWidth />
            </div>

            <div className="flex flex-col gap-2 shrink-0 ">
              <Select<number>
                label={t("modals.create.contract")}
                options={contractOptions}
                placeholder={t("modals.create.selectContract")}
                value={selectedContractId ?? null}
                onChange={handleContractChange}
                disabled={isLoading || !hasContracts}
                includePlaceholderOption={true}
              />
              {showNoContractsToast ? (
                <Toast
                  color="grey"
                  text={t("modals.create.noContractsAvailable")}
                  closable={false}
                  autoClose={false}
                  isFullWidth
                />
              ) : !isContractSelected ? (
                <Toast
                  color="grey"
                  text={t("modals.create.selectContractFirst")}
                  closable={false}
                  autoClose={false}
                  isFullWidth
                />
              ) : null}
            </div>

            {isContractSelected && (
              <>
                <div className="flex flex-col gap-2 shrink-0">
                  <FileUploader
                    label={t("modals.create.uploadDocument")}
                    value={file}
                    onChange={setFile}
                    accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                    maxSizeMB={10}
                  />
                  <Toast
                    color="grey"
                    text={t("modals.create.uploadOrManual")}
                    closable={false}
                    autoClose={false}
                    isFullWidth
                  />
                </div>

                <Input
                  label={t("modals.create.vendorName")}
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder={t("modals.create.vendorNamePlaceholder")}
                  disabled={isLoading}
                />

                <Input
                  label={t("modals.create.vendorBin")}
                  value={vendorBin}
                  onChange={(e) => setVendorBin(e.target.value)}
                  placeholder={t("modals.create.vendorBinPlaceholder")}
                  disabled={isLoading}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Select<number>
                    label={t("modals.create.month")}
                    options={monthOptions}
                    placeholder={t("modals.create.selectMonth")}
                    value={selectedMonth}
                    onChange={(val) => val !== null && setSelectedMonth(val)}
                    disabled={isLoading}
                    includePlaceholderOption={false}
                  />

                  <Select<number>
                    label={t("modals.create.year")}
                    options={yearOptions}
                    placeholder={t("modals.create.selectYear")}
                    value={selectedYear}
                    onChange={(val) => val !== null && setSelectedYear(val)}
                    disabled={isLoading}
                    includePlaceholderOption={false}
                  />
                </div>

                <div className="p-3 radius-sm surface-component-fill">
                  <p className="text-body-bold-md content-base-primary mb-1">
                    {t("modals.create.period")}: {periodData.period}
                  </p>
                  <p className="text-body-regular-sm content-action-neutral mt-1">
                    {formatDateForDisplay(periodData.period_start_date)} -{" "}
                    {formatDateForDisplay(periodData.period_end_date)}
                  </p>
                </div>

                <Input
                  label={t("modals.create.description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("modals.create.descriptionPlaceholder")}
                  disabled={isLoading}
                  isTextarea
                />

                <Input
                  label={t("modals.create.amountTotal")}
                  value={amountTotal}
                  onChange={(e) => setAmountTotal(e.target.value)}
                  placeholder="0.00"
                  onlyNumber
                  disabled={isLoading}
                />

                <Select<string>
                  options={vatRateOptions}
                  label={t("modals.create.vatRate")}
                  value={vatRate}
                  onChange={(val) => val !== null && setVatRate(val)}
                  disabled={isLoading}
                  includePlaceholderOption={false}
                />

                <Input
                  label={t("modals.create.avrNumber")}
                  value={avrNumber}
                  onChange={(e) => setAvrNumber(e.target.value)}
                  placeholder={t("modals.create.avrNumberPlaceholder")}
                  disabled={isLoading}
                />

                <DatePicker
                  label={t("modals.create.avrDate")}
                  value={avrDate}
                  onChange={handleAvrDateChange}
                  mode="single"
                  locale={locale}
                  direction="top"
                  disabled={isLoading}
                  error={avrDateError || undefined}
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              {t("modals.create.cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                isCreatingVendor ||
                isSubmitting ||
                !avrDate ||
                !amountTotal ||
                !avrNumber ||
                !isContractSelected ||
                !!avrDateError
              }>
              {isLoading || isCreatingVendor || isSubmitting ? t("modals.create.creating") : t("modals.create.create")}
            </Button>
          </div>
        </div>
      </ModalForm>
    </>
  );
}

