import { formatDateForDisplay } from "@/shared/utils";

export function formatWarehouseDate(value: string | null | undefined): string {
  if (!value) return "";
  return formatDateForDisplay(value, false);
}

