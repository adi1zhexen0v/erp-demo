import React from "react";
import { Box, Profile2User, CloseCircle, Minus } from "iconsax-react";
import type { BadgeColor } from "@/shared/ui/Badge";
import type { ItemStatus } from "../types";

export function getWarehouseStatusConfig(status: ItemStatus): {
  color: BadgeColor;
  icon: React.ReactElement | undefined;
} {
  switch (status) {
    case "in_stock":
      return { color: "positive", icon: <Box size={12} color="currentColor" variant="Bold" /> };
    case "assigned":
      return { color: "notice", icon: <Profile2User size={12} color="currentColor" variant="Bold" /> };
    case "written_off":
      return { color: "negative", icon: <CloseCircle size={12} color="currentColor" variant="Bold" /> };
    case "disposed":
      return { color: "negative", icon: <Minus size={12} color="currentColor" variant="Bold" /> };
    default:
      return { color: "gray", icon: undefined };
  }
}
