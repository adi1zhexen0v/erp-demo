import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DocumentUpload, Briefcase, Tag, Calculator, Trash, Add, Setting2, InfoCircle } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Input, Select, DatePicker, Checkbox, Prompt, Dropdown } from "@/shared/ui";
import { FileUploader } from "@/shared/components";
import { useScrollDetection, useLocale } from "@/shared/hooks";
import { extractErrorMessage } from "@/shared/utils";
import type { OCRResponse, OCRItem, FixedAssetGroup } from "@/features/accounting/warehouse/types";
import { FIXED_ASSET_GROUP_LABELS, FIXED_ASSET_GROUP_DEFAULTS } from "@/features/accounting/warehouse/consts";
import { formatMoneyKzt, formatPercentageFromRate } from "@/features/accounting/shared";
import type { CreatePurchaseDto, CreatePurchaseItemDto, PurchaseCategory } from "../../../types";
import { DEFAULT_VAT_RATE, calculateAmortization } from "../../../utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: CreatePurchaseDto) => Promise<void>;
  onExtractOCR: (file: File) => Promise<OCRResponse>;
  isLoading: boolean;
  isExtractingOCR: boolean;
}

function createEmptyItem(category: PurchaseCategory = "1330"): CreatePurchaseItemDto {
  return {
    name: "",
    description: "",
    category,
    quantity: 1,
    unit: "шт",
    unit_price: "",
    vat_rate: "0.16",
    ...(category === "2410" && {
      fixed_asset_group: undefined,
      useful_life_months: undefined,
      depreciation_rate: undefined,
    }),
    ...(category === "2730" && {
      useful_life_months: undefined,
      depreciation_rate: undefined,
    }),
  };
}

export default function PurchaseCreateModal({
  isOpen,
  onClose,
  onConfirm,
  onExtractOCR,
  isLoading,
  isExtractingOCR,
}: Props) {
  const { t } = useTranslation("PurchasesPage");
  const locale = useLocale();
  const { scrollRef, hasScroll } = useScrollDetection();

  const [file, setFile] = useState<File | null>(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorBin, setVendorBin] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentDate, setDocumentDate] = useState<Date | null>(null);
  const [items, setItems] = useState<CreatePurchaseItemDto[]>([createEmptyItem("1330")]);
  const [deliveryCost, setDeliveryCost] = useState("");
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState<number | null>(null);
  const [showOCRSuccess, setShowOCRSuccess] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [amortizationModes, setAmortizationModes] = useState<Record<number, "percentage" | "months">>({});
  const [ocrError, setOcrError] = useState<{ title: string; text: string } | null>(null);

  const fixedAssetGroupOptions = useMemo(() => {
    return Object.keys(FIXED_ASSET_GROUP_LABELS).map((key) => ({
      label: FIXED_ASSET_GROUP_LABELS[key as FixedAssetGroup][locale],
      value: key,
    }));
  }, [locale]);

  const categoryOptions: { label: string; value: PurchaseCategory }[] = [
    { label: t("createModal.category1330"), value: "1330" },
    { label: t("createModal.category2410"), value: "2410" },
    { label: t("createModal.category2730"), value: "2730" },
    { label: t("createModal.category7210"), value: "7210" },
  ];

  const unitOptions = useMemo(() => {
    return [
      { label: t("createModal.units.pcs"), value: "шт" },
      { label: t("createModal.units.kg"), value: "кг" },
      { label: t("createModal.units.m"), value: "м" },
      { label: t("createModal.units.m2"), value: "м²" },
      { label: t("createModal.units.m3"), value: "м³" },
      { label: t("createModal.units.l"), value: "л" },
    ];
  }, [t]);

  const vatOptions = useMemo(() => {
    return [
      { label: t("createModal.vatRates.16"), value: "0.16" },
      { label: t("createModal.vatRates.0"), value: "0" },
    ];
  }, [t]);

  const calculations = useMemo(() => {
    let totalWithoutVat = 0;
    let totalVat = 0;

    items.forEach((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      const vatRate = Number(item.vat_rate) || 0;

      const itemTotal = quantity * unitPrice;
      totalWithoutVat += itemTotal;
      totalVat += itemTotal * vatRate;
    });

    const delivery = includeDelivery ? Number(deliveryCost) || 0 : 0;
    const avgVatRate = items.length > 0 && items[0]?.vat_rate ? Number(items[0].vat_rate) : DEFAULT_VAT_RATE;
    const deliveryVat = delivery * avgVatRate;
    const total = totalWithoutVat + totalVat + delivery + deliveryVat;

    return {
      totalWithoutVat,
      totalVat,
      delivery,
      deliveryVat,
      total,
      avgVatRate,
    };
  }, [items, deliveryCost, includeDelivery]);

  const accountingAccount = useMemo(() => {
    const categories = new Set(items.filter((item) => item.name && item.unit_price).map((item) => item.category));
    if (categories.size === 1) {
      const category = Array.from(categories)[0];
      const accountMap: Record<PurchaseCategory, string> = {
        "1330": t("createModal.account1330"),
        "2410": t("createModal.account2410"),
        "2730": t("createModal.account2730"),
        "7210": t("createModal.account7210"),
      };
      return accountMap[category as PurchaseCategory] || t("createModal.mixedAccounts");
    }
    return t("createModal.mixedAccountsDifferent");
  }, [items, t]);

  function removeTrailingZeros(value: string): string {
    if (!value) return value;
    return value.replace(/,00$|\.00$/, "");
  }

  const handleExtractOCR = useCallback(async () => {
    if (!file) return;
    try {
      const result = await onExtractOCR(file);
      setVendorName(result.vendor_name);
      setVendorBin(result.vendor_bin || "");
      setDocumentNumber(result.document_number || "");
      if (result.document_date) {
        setDocumentDate(new Date(result.document_date));
      }
      if (result.items.length > 0) {
        setItems(
          result.items.map((item: OCRItem) => ({
            name: item.name,
            description: "",
            category: "1330" as PurchaseCategory,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: removeTrailingZeros(item.unit_price),
            vat_rate: "0.16",
          })),
        );
      }
      setOcrCompleted(true);
    } catch (err: unknown) {
      setOcrError({
        title: t("messages.errorTitle"),
        text: extractErrorMessage(err, "createModal.ocrExtractionFailed", t),
      });
    }
  }, [file, onExtractOCR, t]);

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

  if (!isOpen) return null;

  function handleItemCategoryChange(index: number, newCategory: PurchaseCategory) {
    setItems(
      items.map((item, idx) =>
        idx === index
          ? {
              ...item,
              category: newCategory,
              ...(newCategory === "2410" && {
                fixed_asset_group: undefined,
                useful_life_months: undefined,
                depreciation_rate: undefined,
              }),
              ...(newCategory === "2730" && {
                useful_life_months: undefined,
                depreciation_rate: undefined,
              }),
              ...(newCategory !== "2410" &&
                newCategory !== "2730" && {
                  fixed_asset_group: undefined,
                  useful_life_months: undefined,
                  depreciation_rate: undefined,
                }),
            }
          : item,
      ),
    );
  }

  function handleFixedAssetGroupChange(index: number, group: FixedAssetGroup | null) {
    const item = items[index];
    const newItem = { ...item, fixed_asset_group: group || undefined };

    if (group && FIXED_ASSET_GROUP_DEFAULTS[group]) {
      const defaults = FIXED_ASSET_GROUP_DEFAULTS[group];
      newItem.depreciation_rate = defaults.rate.toString();
      newItem.useful_life_months = defaults.months;
    }

    setItems(items.map((it, idx) => (idx === index ? newItem : it)));
  }

  function handleAmortizationModeChange(index: number, mode: "percentage" | "months") {
    setAmortizationModes((prev) => ({ ...prev, [index]: mode }));
  }

  function handleItemChange(index: number, field: keyof CreatePurchaseItemDto, value: any) {
    const updatedItems = items.map((item, idx) => {
      if (idx !== index) return item;

      const updatedItem = { ...item, [field]: value };

      return updatedItem;
    });

    setItems(updatedItems);
  }

  function handleAddItem() {
    setItems([...items, createEmptyItem("1330")]);
  }

  function handleRemoveItem(index: number) {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
      const newModes: Record<number, "percentage" | "months"> = {};
      Object.entries(amortizationModes).forEach(([key, value]) => {
        const idx = Number(key);
        if (idx < index) newModes[idx] = value;
        if (idx > index) newModes[idx - 1] = value;
      });
      setAmortizationModes(newModes);
    }
  }

  const showCalculation = vendorName && items.some((item) => item.name && item.unit_price && item.category);

  async function handleConfirm() {
    if (isLoading || !vendorName || items.length === 0) return;

    const validItems = items
      .map((item, index) => {
        if (item.category !== "2410" && item.category !== "2730") return item;

        const mode = amortizationModes[index] || "percentage";
        const derived = calculateAmortization({ item, mode });

        if (!derived) return item;

        return {
          ...item,
          depreciation_rate: item.depreciation_rate || derived.rate?.toString(),
          useful_life_months: item.useful_life_months || derived.months,
        };
      })
      .filter((item) => item.name && item.unit_price && item.quantity && item.category);

    if (validItems.length === 0) return;

    const firstCategory = validItems[0]?.category || "1330";

    const dto: CreatePurchaseDto = {
      vendor_name: vendorName,
      vendor_bin: vendorBin || undefined,
      vendor_address: vendorAddress || undefined,
      document_number: documentNumber || undefined,
      document_date: documentDate ? documentDate.toISOString().split("T")[0] : undefined,
      category: firstCategory,
      items: validItems,
      delivery_cost: includeDelivery && deliveryCost ? deliveryCost : undefined,
    };

    await onConfirm(dto);
    handleClose();
  }

  function handleClose() {
    setFile(null);
    setVendorName("");
    setVendorBin("");
    setVendorAddress("");
    setDocumentNumber("");
    setDocumentDate(null);
    setItems([createEmptyItem("1330")]);
    setDeliveryCost("");
    setIncludeDelivery(false);
    setShowOCRSuccess(false);
    setOcrCompleted(false);
    setAmortizationModes({});
    setOcrError(null);
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
          namespace="PurchasesPage"
        />
      )}

      {showOCRSuccess && !isExtractingOCR && (
        <Prompt
          title={t("messages.createSuccessTitle")}
          text={t("createModal.ocrSuccess")}
          variant="success"
          onClose={() => setShowOCRSuccess(false)}
          namespace="PurchasesPage"
        />
      )}

      {ocrError && (
        <Prompt
          title={ocrError.title}
          text={ocrError.text}
          variant="error"
          onClose={() => setOcrError(null)}
          namespace="PurchasesPage"
        />
      )}

      <ModalForm icon={DocumentUpload} onClose={handleClose} allowCloseInOverlay={false}>
        <div className="flex flex-col h-full">
          <h4 className="text-display-2xs content-base-primary shrink-0 pb-5 border-b surface-base-stroke">
            {t("createModal.title")}
          </h4>

          <div
            ref={scrollRef}
            className={cn("flex-1 overflow-auto flex flex-col gap-4 p-1 my-5 page-scroll", hasScroll && "pr-3")}>
            <div className="flex flex-col gap-2">
              <FileUploader
                label={t("createModal.uploadDocument")}
                value={file}
                onChange={setFile}
                accept=".jpg,.jpeg,.png,.webp,.gif"
                maxSizeMB={10}
              />
            </div>

            <div className="flex flex-col gap-3 p-4 radius-lg border surface-base-stroke">
              <div className="flex items-center gap-2 pb-3 border-b surface-base-stroke">
                <div className="w-8 h-8 aspect-square flex items-center justify-center surface-component-fill radius-xs content-action-neutral">
                  <Briefcase size={16} color="currentColor" />
                </div>

                <h5 className="text-body-bold-md content-base-primary">{t("createModal.vendor")}</h5>
              </div>

              <Input
                label={t("createModal.vendorName")}
                placeholder={t("createModal.vendorNamePlaceholder") || ""}
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                disabled={isLoading}
              />

              <Input
                label={t("createModal.vendorBin")}
                placeholder={t("createModal.vendorBinPlaceholder") || ""}
                value={vendorBin}
                onChange={(e) => setVendorBin(e.target.value)}
                disabled={isLoading}
              />

              <Input
                label={t("createModal.documentNumber")}
                placeholder={t("createModal.documentNumberPlaceholder") || ""}
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                disabled={isLoading}
              />

              <DatePicker
                label={t("createModal.documentDate")}
                placeholder={t("createModal.documentDatePlaceholder") || ""}
                value={documentDate}
                onChange={setDocumentDate}
                locale={locale}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-3 p-4 radius-lg border surface-base-stroke">
              <div className="flex items-center gap-2 pb-3 border-b surface-base-stroke">
                <div className="w-8 h-8 aspect-square flex items-center justify-center surface-component-fill radius-xs content-action-neutral">
                  <Setting2 size={16} color="currentColor" />
                </div>
                <h5 className="text-body-bold-md content-base-primary">{t("createModal.generalSettings")}</h5>
              </div>

              <Checkbox
                state={includeDelivery ? "checked" : "unchecked"}
                onChange={() => setIncludeDelivery(!includeDelivery)}
                label={t("createModal.includeDelivery")}
                disabled={isLoading}
              />

              {includeDelivery && (
                <Input
                  label={t("createModal.deliveryCost")}
                  placeholder=""
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(e.target.value)}
                  disabled={isLoading}
                  onlyNumber
                />
              )}
            </div>

            {items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex flex-col gap-3 p-4 radius-lg border surface-base-stroke">
                <div className="flex items-center justify-between pb-3 border-b surface-base-stroke">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 aspect-square flex items-center justify-center surface-component-fill radius-xs content-action-neutral">
                      <Tag size={16} color="currentColor" />
                    </div>
                    <h5 className="text-body-bold-md content-base-primary">
                      {t("createModal.item")} {items.length > 1 ? itemIndex + 1 : ""}
                    </h5>
                  </div>
                  {items.length > 1 && (
                    <Button
                      variant="danger"
                      isIconButton
                      className="w-8! aspect-square! p-0! rounded-[4px]!"
                      onClick={() => handleRemoveItem(itemIndex)}
                      disabled={isLoading}>
                      <Trash size={16} color="currentColor" />
                    </Button>
                  )}
                </div>

                <Select
                  label={t("createModal.category")}
                  options={categoryOptions}
                  value={item.category}
                  onChange={(val) => val && handleItemCategoryChange(itemIndex, val)}
                  disabled={isLoading}
                  includePlaceholderOption={false}
                  placeholder={t("createModal.selectPlaceholder")}
                />

                {item.category === "2410" &&
                  (() => {
                    const mode = amortizationModes[itemIndex] || "percentage";
                    const derived = calculateAmortization({ item, mode });

                    return (
                      <>
                        <Select
                          label={t("createModal.fixedAssetGroup")}
                          options={fixedAssetGroupOptions}
                          value={item.fixed_asset_group}
                          onChange={(val) => handleFixedAssetGroupChange(itemIndex, val as FixedAssetGroup | null)}
                          disabled={isLoading}
                          includePlaceholderOption={true}
                          placeholder={t("createModal.selectPlaceholder")}
                        />

                        <Select
                          label={t("createModal.amortizationInputMode")}
                          options={[
                            {
                              label: t("createModal.amortizationModePercentage"),
                              value: "percentage",
                            },
                            {
                              label: t("createModal.amortizationModeMonths"),
                              value: "months",
                            },
                          ]}
                          value={mode}
                          onChange={(val) =>
                            val && handleAmortizationModeChange(itemIndex, val as "percentage" | "months")
                          }
                          disabled={isLoading}
                          includePlaceholderOption={false}
                          placeholder={t("createModal.selectPlaceholder")}
                        />

                        {mode === "percentage" ? (
                          <>
                            <div className="flex flex-col gap-2">
                              <div className="relative flex items-center gap-2">
                                <label className="text-label-sm content-base-primary">
                                  {t("createModal.depreciationRate")}
                                </label>
                                <div
                                  className="relative flex items-center"
                                  onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 1)}
                                  onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                  <Dropdown
                                    open={hoveredTooltipIndex === itemIndex * 10 + 1}
                                    onClose={() => setHoveredTooltipIndex(null)}
                                    direction="bottom"
                                    align="right"
                                    width="w-max"
                                    className="elevation-level-2!">
                                    <InfoCircle
                                      size={14}
                                      color="currentColor"
                                      className="content-action-neutral cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                    <div
                                      className="p-3 flex flex-col gap-1 w-48"
                                      onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 1)}
                                      onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                      <p className="text-label-xs content-base-primary">
                                        {t("createModal.depreciationAutoCalcTooltip")}
                                      </p>
                                    </div>
                                  </Dropdown>
                                </div>
                              </div>
                              <Input
                                placeholder={t("createModal.depreciationRatePlaceholder")}
                                value={
                                  item.depreciation_rate
                                    ? Math.round(Number(item.depreciation_rate) * 100).toString()
                                    : ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "") {
                                    handleItemChange(itemIndex, "depreciation_rate", undefined);
                                  } else {
                                    const numVal = Number(val);
                                    if (!isNaN(numVal) && numVal >= 0 && numVal <= 100) {
                                      handleItemChange(itemIndex, "depreciation_rate", (numVal / 100).toString());
                                    }
                                  }
                                }}
                                disabled={isLoading}
                                onlyNumber
                              />
                              {derived?.months && (
                                <p className="text-label-xs content-action-neutral">
                                  {derived.months} {t("createModal.months")} ={" "}
                                  {formatMoneyKzt(derived.monthlyAmount || 0)} / {t("createModal.month")}
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col gap-2">
                              <div className="relative flex items-center gap-2">
                                <label className="text-label-sm content-base-primary">
                                  {t("createModal.usefulLifeMonths")}
                                </label>
                                <div
                                  className="relative flex items-center"
                                  onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 2)}
                                  onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                  <Dropdown
                                    open={hoveredTooltipIndex === itemIndex * 10 + 2}
                                    onClose={() => setHoveredTooltipIndex(null)}
                                    direction="bottom"
                                    align="right"
                                    width="w-max"
                                    className="elevation-level-2!">
                                    <InfoCircle
                                      size={14}
                                      color="currentColor"
                                      className="content-action-neutral cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                    <div
                                      className="p-3 flex flex-col gap-1 w-48"
                                      onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 2)}
                                      onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                      <p className="text-label-xs content-base-primary">
                                        {t("createModal.depreciationAutoCalcTooltip")}
                                      </p>
                                    </div>
                                  </Dropdown>
                                </div>
                              </div>
                              <Input
                                placeholder={t("createModal.usefulLifeMonthsPlaceholder") || ""}
                                value={item.useful_life_months?.toString() || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    itemIndex,
                                    "useful_life_months",
                                    e.target.value ? Number(e.target.value) : undefined,
                                  )
                                }
                                disabled={isLoading}
                                onlyNumber
                              />
                              {derived?.rate && (
                                <p className="text-label-xs content-action-neutral">
                                  {formatPercentageFromRate(derived.rate, locale)} = {formatMoneyKzt(derived.monthlyAmount || 0)} /{" "}
                                  {t("createModal.month")}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}

                {item.category === "2730" &&
                  (() => {
                    const mode = amortizationModes[itemIndex] || "percentage";
                    const derived = calculateAmortization({ item, mode });

                    return (
                      <>
                        <Select
                          label={t("createModal.amortizationInputMode")}
                          options={[
                            {
                              label: t("createModal.amortizationModePercentage"),
                              value: "percentage",
                            },
                            {
                              label: t("createModal.amortizationModeMonths"),
                              value: "months",
                            },
                          ]}
                          value={mode}
                          onChange={(val) =>
                            val && handleAmortizationModeChange(itemIndex, val as "percentage" | "months")
                          }
                          disabled={isLoading}
                          includePlaceholderOption={false}
                          placeholder={t("createModal.selectPlaceholder")}
                        />

                        {mode === "percentage" ? (
                          <>
                            <div className="flex flex-col gap-2">
                              <div className="relative flex items-center gap-2">
                                <label className="text-label-sm content-base-primary">
                                  {t("createModal.depreciationRate")}
                                </label>
                                <div
                                  className="relative flex items-center"
                                  onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 3)}
                                  onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                  <Dropdown
                                    open={hoveredTooltipIndex === itemIndex * 10 + 3}
                                    onClose={() => setHoveredTooltipIndex(null)}
                                    direction="bottom"
                                    align="right"
                                    width="w-max"
                                    className="elevation-level-2!">
                                    <InfoCircle
                                      size={14}
                                      color="currentColor"
                                      className="content-action-neutral cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                    <div
                                      className="p-3 flex flex-col gap-1 w-48"
                                      onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 3)}
                                      onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                      <p className="text-label-xs content-base-primary">
                                        {t("createModal.depreciationAutoCalcTooltip")}
                                      </p>
                                    </div>
                                  </Dropdown>
                                </div>
                              </div>
                              <Input
                                placeholder={t("createModal.depreciationRatePlaceholder")}
                                value={
                                  item.depreciation_rate
                                    ? Math.round(Number(item.depreciation_rate) * 100).toString()
                                    : ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "") {
                                    handleItemChange(itemIndex, "depreciation_rate", undefined);
                                  } else {
                                    const numVal = Number(val);
                                    if (!isNaN(numVal) && numVal >= 0 && numVal <= 100) {
                                      handleItemChange(itemIndex, "depreciation_rate", (numVal / 100).toString());
                                    }
                                  }
                                }}
                                disabled={isLoading}
                                onlyNumber
                              />
                              {derived?.months && (
                                <p className="text-label-xs content-action-neutral">
                                  {derived.months} {t("createModal.months")} ={" "}
                                  {formatMoneyKzt(derived.monthlyAmount || 0)} / {t("createModal.month")}
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col gap-2">
                              <div className="relative flex items-center gap-2">
                                <label className="text-label-sm content-base-primary">
                                  {t("createModal.usefulLifeMonths")}
                                </label>
                                <div
                                  className="relative flex items-center"
                                  onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 4)}
                                  onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                  <Dropdown
                                    open={hoveredTooltipIndex === itemIndex * 10 + 4}
                                    onClose={() => setHoveredTooltipIndex(null)}
                                    direction="bottom"
                                    align="right"
                                    width="w-max"
                                    className="elevation-level-2!">
                                    <InfoCircle
                                      size={14}
                                      color="currentColor"
                                      className="content-action-neutral cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                    <div
                                      className="p-3 flex flex-col gap-1 w-48"
                                      onMouseEnter={() => setHoveredTooltipIndex(itemIndex * 10 + 4)}
                                      onMouseLeave={() => setHoveredTooltipIndex(null)}>
                                      <p className="text-label-xs content-base-primary">
                                        {t("createModal.depreciationAutoCalcTooltip")}
                                      </p>
                                    </div>
                                  </Dropdown>
                                </div>
                              </div>
                              <Input
                                placeholder={t("createModal.usefulLifeMonthsPlaceholder") || ""}
                                value={item.useful_life_months?.toString() || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    itemIndex,
                                    "useful_life_months",
                                    e.target.value ? Number(e.target.value) : undefined,
                                  )
                                }
                                disabled={isLoading}
                                onlyNumber
                              />
                              {derived?.rate && (
                                <p className="text-label-xs content-action-neutral">
                                  {formatPercentageFromRate(derived.rate, locale)} = {formatMoneyKzt(derived.monthlyAmount || 0)} /{" "}
                                  {t("createModal.month")}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}

                <Input
                  label={t("createModal.itemName")}
                  placeholder={t("createModal.itemNamePlaceholder") || ""}
                  value={item.name}
                  onChange={(e) => handleItemChange(itemIndex, "name", e.target.value)}
                  disabled={isLoading}
                />

                <Input
                  label={t("createModal.description")}
                  placeholder={t("createModal.descriptionPlaceholder") || ""}
                  value={item.description || ""}
                  onChange={(e) => handleItemChange(itemIndex, "description", e.target.value)}
                  disabled={isLoading}
                  isTextarea
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t("createModal.quantity")}
                    placeholder=""
                    value={item.quantity.toString()}
                    onChange={(e) => handleItemChange(itemIndex, "quantity", Number(e.target.value) || 1)}
                    disabled={isLoading}
                    onlyNumber
                  />

                  <Select
                    label={t("createModal.unit")}
                    options={unitOptions}
                    value={item.unit}
                    onChange={(val) => val && handleItemChange(itemIndex, "unit", val)}
                    disabled={isLoading}
                    includePlaceholderOption={false}
                    placeholder={t("createModal.selectPlaceholder")}
                  />
                </div>

                <Select
                  label={t("createModal.vat")}
                  options={vatOptions}
                  value={item.vat_rate}
                  onChange={(val) => val && handleItemChange(itemIndex, "vat_rate", val)}
                  disabled={isLoading}
                  includePlaceholderOption={false}
                  placeholder={t("createModal.selectPlaceholder")}
                />

                <Input
                  label={t("createModal.unitPrice")}
                  placeholder=""
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(itemIndex, "unit_price", e.target.value)}
                  disabled={isLoading}
                  onlyNumber
                />
              </div>
            ))}

            <Button variant="secondary" size="md" onClick={handleAddItem} disabled={isLoading}>
              <Add size={16} color="currentColor" />
              {t("createModal.addItem")}
            </Button>

            {showCalculation && (
              <div className="flex flex-col gap-3 p-4 radius-lg border surface-base-stroke">
                <div className="flex items-center gap-2 pb-3 border-b surface-base-stroke">
                  <div className="w-8 h-8 aspect-square flex items-center justify-center surface-component-fill radius-xs content-action-neutral">
                    <Calculator size={16} color="currentColor" />
                  </div>
                  <h5 className="text-body-bold-md content-base-primary">{t("createModal.calculation")}</h5>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-label-sm content-base-primary">{t("createModal.amountWithoutVat")}</span>
                    <span className="text-body-bold-md content-base-primary">
                      {formatMoneyKzt(calculations.totalWithoutVat)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-label-sm content-base-primary">
                      {t("createModal.vat")} ({formatPercentageFromRate(calculations.avgVatRate, locale)})
                    </span>
                    <span className="text-label-sm content-warning-500">{formatMoneyKzt(calculations.totalVat)}</span>
                  </div>

                  {includeDelivery && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-label-sm content-base-primary">
                          {t("createModal.delivery")} {t("createModal.withoutVat")}
                        </span>
                        <span className="text-label-sm content-info-500">{formatMoneyKzt(calculations.delivery)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-label-sm content-base-primary">{t("createModal.deliveryVat")}</span>
                        <span className="text-label-sm content-warning-500">
                          {formatMoneyKzt(calculations.deliveryVat)}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-2 border-t surface-base-stroke">
                    <span className="text-body-bold-lg content-base-primary">{t("createModal.total")}</span>
                    <span className="text-body-bold-lg text-positive-500">{formatMoneyKzt(calculations.total)}</span>
                  </div>

                  <div className="pt-2 border-t surface-base-stroke">
                    <p className="text-label-xs content-action-neutral">{t("createModal.accountingAccount")}</p>
                    <p className="text-label-sm content-base-primary">{accountingAccount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[2fr_3fr] p-1 gap-2 pt-3 border-t surface-base-stroke shrink-0">
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              {t("createModal.cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={
                isLoading ||
                !vendorName ||
                items.length === 0 ||
                !items.some((item) => item.name && item.unit_price && item.quantity && item.category)
              }>
              {isLoading ? t("messages.loading") : t("createModal.confirm")}
            </Button>
          </div>
        </div>
      </ModalForm>
    </>
  );
}

