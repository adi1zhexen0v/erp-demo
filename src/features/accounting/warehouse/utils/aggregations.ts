import { toNumber } from "@/shared/utils";
import type { InventoryUnit } from "../types";

export interface WarehouseSummary {
  totalUnits: number;
  inStockCount: number;
  assignedCount: number;
  fixedAssetsCount: number;
  totalValue: string;
  totalResidualValue: string;
}

export function calculateWarehouseSummary(units: InventoryUnit[]): WarehouseSummary {
  let totalUnits = 0;
  let inStockCount = 0;
  let assignedCount = 0;
  let fixedAssetsCount = 0;
  let totalValue = 0;
  let totalResidualValue = 0;

  for (const unit of units) {
    totalUnits++;

    if (unit.status === "in_stock") {
      inStockCount++;
    } else if (unit.status === "assigned") {
      assignedCount++;
    }

    if (unit.asset_type === "fixed_asset") {
      fixedAssetsCount++;
    }

    totalValue += toNumber(unit.unit_cost);
    totalResidualValue += toNumber(unit.residual_value);
  }

  return {
    totalUnits,
    inStockCount,
    assignedCount,
    fixedAssetsCount,
    totalValue: totalValue.toFixed(2),
    totalResidualValue: totalResidualValue.toFixed(2),
  };
}


