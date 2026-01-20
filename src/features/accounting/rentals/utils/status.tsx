import React from "react";
import { DocumentText, TickCircle } from "iconsax-react";
import type { BadgeColor } from "@/shared/ui/Badge";

export function getRentalPaymentStatusConfig(
  status: string,
): { color: BadgeColor; icon: React.ReactElement | undefined } {
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

