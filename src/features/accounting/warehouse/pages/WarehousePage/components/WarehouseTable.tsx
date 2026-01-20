import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { InfoCircle, Eye, Box, ScanBarcode } from "iconsax-react";
import { QRCodeCanvas } from "qrcode.react";
import { Table, Dropdown, Button, ModalWrapper, Toast } from "@/shared/ui";
import Badge from "@/shared/ui/Badge";
import { formatMoneyKzt } from "@/features/accounting/shared";
import { toNumber } from "@/shared/utils";
import type { InventoryUnit } from "../../../types";
import type { SortKey, SortConfig } from "../../../hooks";
import { getWarehouseStatusConfig, formatWarehouseDate } from "../../../utils";
import WarehouseActions from "./WarehouseActions";

interface Props {
  items: InventoryUnit[];
  onOpen: (id: number) => void;
  onAssign: (id: number) => void;
  onReturn: (id: number) => void;
  onWriteOff: (id: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
  assigningId?: number | null;
  writingOffId?: number | null;
  hideStatusColumn?: boolean;
}

export default function WarehouseTable({
  items,
  onOpen,
  onAssign,
  onReturn,
  onWriteOff,
  sortConfig,
  onSort,
  assigningId,
  writingOffId,
  hideStatusColumn = false,
}: Props) {
  const { t, i18n } = useTranslation("WarehousePage");
  const _locale = (i18n.language as "ru" | "en" | "kk") || "ru";
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [hoveredDepreciationId, setHoveredDepreciationId] = useState<number | null>(null);
  const [qrModalBarcode, setQrModalBarcode] = useState<string | null>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleDownloadQR = useCallback(() => {
    const canvas = qrRef.current;
    if (!canvas || !qrModalBarcode) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `warehouse-unit-${qrModalBarcode}.png`;
    link.href = url;
    link.click();
  }, [qrModalBarcode]);

  const qrUrl = qrModalBarcode ? `${window.location.origin}/warehouse/units/${qrModalBarcode}` : "";

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex items-center gap-3">
        <div className="w-10 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
          <Box size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-bold-lg content-base-primary">{t("section.title")}</h3>
          <p className="text-body-regular-sm content-action-neutral">{t("section.subtitle")}</p>
        </div>
      </div>

      <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "name" ? sortConfig.direction : undefined}
              onSort={() => onSort("name")}>
              {t("table.name")}
            </Table.HeadCell>
            <Table.HeadCell>{t("table.category")}</Table.HeadCell>
            {!hideStatusColumn && (
              <Table.HeadCell
                sortable
                sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
                onSort={() => onSort("status")}>
                {t("table.status")}
              </Table.HeadCell>
            )}
            <Table.HeadCell>{t("table.barcode")}</Table.HeadCell>
            <Table.HeadCell>{t("table.serialNumber")}</Table.HeadCell>
            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "price" ? sortConfig.direction : undefined}
              onSort={() => onSort("price")}>
              {t("table.cost")}
            </Table.HeadCell>
            <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {items.map((unit, index) => {
            const assetTypeLabel = t(`assetType.${unit.asset_type}`) || unit.asset_type;
            const statusLabel = t(`status.${unit.status}`) || unit.status_display;
            const statusConfig = getWarehouseStatusConfig(unit.status);

            return (
              <Table.Row key={unit.id}>
                <Table.Cell isBold>
                  <div className="flex flex-col gap-1">
                    <span>{unit.item_name}</span>
                    {unit.assigned_to_name && (
                      <span className="text-label-xs content-action-neutral">
                        {t("table.assignedTo")}: {unit.assigned_to_name}
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant="soft" color="gray" text={assetTypeLabel} />
                </Table.Cell>
                {!hideStatusColumn && (
                  <Table.Cell>
                    <Badge variant="soft" color={statusConfig.color} text={statusLabel} icon={statusConfig.icon} />
                  </Table.Cell>
                )}
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{unit.barcode}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{unit.serial_number}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-sm content-base-primary">{formatMoneyKzt(unit.unit_cost)}</span>
                    {unit.is_depreciable && unit.residual_value && (
                      <div className="flex items-center gap-1">
                        <span className="text-label-xs content-action-neutral">{t("table.residualValue")}:</span>
                        <span className="text-label-xs content-base-primary">
                          {formatMoneyKzt(unit.residual_value)}
                        </span>
                        {unit.accumulated_depreciation && toNumber(unit.accumulated_depreciation) > 0 && (
                          <div
                            className="relative flex items-center"
                            onMouseEnter={() => setHoveredDepreciationId(unit.id)}
                            onMouseLeave={() => setHoveredDepreciationId(null)}>
                            <Dropdown
                              open={hoveredDepreciationId === unit.id}
                              onClose={() => setHoveredDepreciationId(null)}
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
                                className="p-3 flex flex-col gap-1 min-w-48"
                                onMouseEnter={() => setHoveredDepreciationId(unit.id)}
                                onMouseLeave={() => setHoveredDepreciationId(null)}>
                                <div className="flex justify-between gap-4 text-label-xs">
                                  <span className="content-action-neutral">{t("tooltip.originalCost")}:</span>
                                  <span className="content-base-primary">{formatMoneyKzt(unit.unit_cost)}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-label-xs">
                                  <span className="content-action-neutral">{t("tooltip.accumulated")}:</span>
                                  <span className="content-action-negative">
                                    {formatMoneyKzt(unit.accumulated_depreciation)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 text-label-xs">
                                  <span className="content-action-neutral">{t("tooltip.residualValue")}:</span>
                                  <span className="content-action-positive">{formatMoneyKzt(unit.residual_value)}</span>
                                </div>
                                {unit.next_depreciation_date && (
                                  <div className="flex justify-between gap-4 text-label-xs pt-1 border-t surface-base-stroke">
                                    <span className="content-action-neutral">{t("tooltip.nextDepreciation")}:</span>
                                    <span className="content-base-primary">
                                      {formatWarehouseDate(unit.next_depreciation_date)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Dropdown>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      isIconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(unit.id);
                      }}
                      className="w-8! radius-xs! p-0!">
                      <Eye size={16} color="currentColor" />
                    </Button>
                    <Button
                      variant="secondary"
                      isIconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setQrModalBarcode(unit.barcode);
                      }}
                      className="w-8! radius-xs! p-0!">
                      <ScanBarcode size={16} color="currentColor" />
                    </Button>
                    <WarehouseActions
                      item={unit}
                      onAssign={onAssign}
                      onReturn={onReturn}
                      onWriteOff={onWriteOff}
                      assigningId={assigningId}
                      writingOffId={writingOffId}
                      isOpen={openDropdownId === unit.id}
                      onToggle={(isOpen) => {
                        setOpenDropdownId(isOpen ? unit.id : null);
                      }}
                      direction={index === items.length - 1 ? "top" : "bottom"}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Table>

      {qrModalBarcode && (
        <ModalWrapper onClose={() => setQrModalBarcode(null)} width="w-96">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full pb-3 border-b surface-base-stroke">
              <h3 className="text-body-bold-lg text-center content-base-primary">{t("qrModal.title")}</h3>
            </div>
            <div className="p-4 radius-md">
              <QRCodeCanvas ref={qrRef} value={qrUrl} size={240} level="M" bgColor="#ffffff" fgColor="#000000" />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Toast color="grey" text={t("qrModal.hint")} closable={false} autoClose={false} onClose={() => {}} />
              <div className="flex gap-3">
                <Button variant="secondary" size="md" className="flex-1" onClick={() => setQrModalBarcode(null)}>
                  {t("qrModal.close")}
                </Button>
                <Button variant="primary" size="md" className="flex-1" onClick={handleDownloadQR}>
                  {t("qrModal.download")}
                </Button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

