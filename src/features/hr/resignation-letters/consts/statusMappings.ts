import type { StatusMapping } from "@/shared/components/StatusIndicator/mappings";
import type { ResignationStatus } from "../types";
import { RESIGNATION_STATUS_MAP } from "./statuses";

const colorToClasses: Record<string, { bg: string; dot: string }> = {
  notice: { bg: "bg-notice-500/40", dot: "bg-notice-500" },
  positive: { bg: "bg-positive-500/40", dot: "bg-positive-500" },
  negative: { bg: "bg-negative-500/40", dot: "bg-negative-500" },
  info: { bg: "bg-info-500/40", dot: "bg-info-500" },
};

export const RESIGNATION_STATUS_MAPPING: Record<string, StatusMapping> = Object.keys(RESIGNATION_STATUS_MAP).reduce(
  (acc, key) => {
    const status = key as ResignationStatus;
    const statusInfo = RESIGNATION_STATUS_MAP[status];
    const colors = colorToClasses[statusInfo.color] || colorToClasses.info;

    acc[status] = {
      bg: colors.bg,
      dot: colors.dot,
      titleKey: statusInfo.label,
      namespace: "ContractsPage",
    };

    return acc;
  },
  {} as Record<string, StatusMapping>,
);

