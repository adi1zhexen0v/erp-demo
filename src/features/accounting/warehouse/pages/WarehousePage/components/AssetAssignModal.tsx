import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Profile2User, Box1 } from "iconsax-react";
import { ModalForm, Button, Input, Select } from "@/shared/ui";
import { useScrollDetection } from "@/shared/hooks";
import { useGetWorkersQuery } from "@/features/hr/employees";
import type { InventoryUnit, AssignItemDto } from "../../../types";

interface Props {
  item: InventoryUnit | null;
  onClose: () => void;
  onConfirm: (id: number, dto: AssignItemDto) => Promise<void>;
  isLoading: boolean;
  hasBackground?: boolean;
}

export default function AssetAssignModal({ item, onClose, onConfirm, isLoading, hasBackground = true }: Props) {
  const { t } = useTranslation("WarehousePage");
  const { data: workers } = useGetWorkersQuery();
  const { scrollRef, hasScroll } = useScrollDetection();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const employeeOptions = useMemo(() => {
    if (!workers) return [];
    return workers.map((worker) => ({
      label: worker.full_name,
      value: worker.id,
    }));
  }, [workers]);

  if (!item) return null;

  async function handleSubmit() {
    if (isLoading || !selectedEmployeeId || !item) return;
    await onConfirm(item.id, {
      employee_id: selectedEmployeeId,
      notes: notes || undefined,
    });
    onClose();
  }

  return (
    <ModalForm
      allowCloseInOverlay={false}
      icon={Profile2User}
      onClose={onClose}
      hasBackground={hasBackground}
      zIndex={hasBackground ? 10000 : 10001}
      resize={false}>
      <div className="flex flex-col gap-6 h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
          <h4 className="text-display-2xs content-base-primary">{t("assignModal.title")}</h4>
        </div>

        <div ref={scrollRef} className={cn("flex-1 overflow-auto min-h-0 p-1 page-scroll", hasScroll && "pr-5")}>
          <div className="flex flex-col">
            <div className="py-3 flex items-center gap-3 border-b surface-base-stroke">
              <span className="content-action-brand">
                <Box1 size={16} color="currentColor" />
              </span>
              <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">
                {t("assignModal.item")}
              </span>
              <p className="text-body-bold-md content-base-primary text-right">{item.item_name}</p>
            </div>

            <div className="flex flex-col gap-5 pt-4">
              <Select
                label={t("assignModal.employee")}
                placeholder={t("assignModal.selectEmployee")}
                options={employeeOptions}
                value={selectedEmployeeId}
                onChange={(val) => setSelectedEmployeeId(val)}
                disabled={isLoading}
              />

              <Input
                label={t("assignModal.notes")}
                placeholder={t("assignModal.notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                isTextarea
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-2 pt-4 border-t surface-base-stroke p-1 shrink-0">
          <Button variant="secondary" size="lg" onClick={onClose} disabled={isLoading}>
            {t("assignModal.cancel")}
          </Button>
          <Button variant="primary" size="lg" onClick={handleSubmit} disabled={isLoading || !selectedEmployeeId}>
            {isLoading ? t("loading") : t("assignModal.confirm")}
          </Button>
        </div>
      </div>
    </ModalForm>
  );
}

