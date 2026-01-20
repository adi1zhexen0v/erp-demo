import React from "react";
import { DocumentText, TickCircle, Clock, Math } from "iconsax-react";
import type { BadgeColor } from "@/shared/ui/Badge";
import type { PayrollStatus } from "../../payroll/types";

export type DraftApprovedPaidStatus = "draft" | "approved" | "paid";

export interface StatusBadgeConfig {
  color: BadgeColor;
  icon: React.ReactElement | undefined;
}

export function getDraftApprovedPaidStatusConfig(
  status: DraftApprovedPaidStatus,
): StatusBadgeConfig {
  switch (status) {
    case "draft":
      return { color: "info", icon: <DocumentText size={14} color="currentColor" /> };
    case "approved":
      return { color: "positive", icon: <TickCircle size={14} color="currentColor" /> };
    case "paid":
      return { color: "positive", icon: <TickCircle size={14} color="currentColor" variant="Bold" /> };
    default:
      return { color: "gray", icon: undefined };
  }
}

export function getPayrollStatusConfig(status: PayrollStatus): StatusBadgeConfig {
  switch (status) {
    case "draft":
      return { color: "info", icon: <Clock size={16} color="currentColor" /> };
    case "calculated":
      return { color: "notice", icon: <Math size={16} color="currentColor" /> };
    case "approved":
      return { color: "positive", icon: <TickCircle size={16} color="currentColor" /> };
    case "paid":
      return { color: "positive", icon: <TickCircle size={16} color="currentColor" variant="Bold" /> };
    default:
      return { color: "gray", icon: undefined };
  }
}

