import { toNumber } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import type { TaxCategory } from "../types";

export interface GroupedEntryData {
  key: string;
  labelKey: string;
  count: number;
  gross: number;
  net: number;
}

export function groupEntriesByTaxCategory(
  entries: Array<{ tax_category: TaxCategory; gross_salary: string; net_salary: string }>,
  _locale: Locale,
): GroupedEntryData[] {
  const groups: Record<TaxCategory, { count: number; gross: number; net: number }> = {} as Record<
    TaxCategory,
    { count: number; gross: number; net: number }
  >;

  entries.forEach((entry) => {
    if (!groups[entry.tax_category]) {
      groups[entry.tax_category] = { count: 0, gross: 0, net: 0 };
    }
    groups[entry.tax_category].count++;
    groups[entry.tax_category].gross += toNumber(entry.gross_salary);
    groups[entry.tax_category].net += toNumber(entry.net_salary);
  });

  return Object.entries(groups).map(([category, data]) => ({
    key: category,
    labelKey: `reportingSection.taxCategory.${category}`,
    ...data,
  }));
}

export function groupEntriesByResidency(
  entries: Array<{ is_resident: boolean; gross_salary: string; net_salary: string }>,
): GroupedEntryData[] {
  const residents = { count: 0, gross: 0, net: 0 };
  const nonResidents = { count: 0, gross: 0, net: 0 };

  entries.forEach((entry) => {
    const target = entry.is_resident ? residents : nonResidents;
    target.count++;
    target.gross += toNumber(entry.gross_salary);
    target.net += toNumber(entry.net_salary);
  });

  const result: GroupedEntryData[] = [];
  if (residents.count > 0) {
    result.push({ key: "resident", labelKey: "reportingSection.group.residents", ...residents });
  }
  if (nonResidents.count > 0) {
    result.push({ key: "non_resident", labelKey: "reportingSection.group.nonResidents", ...nonResidents });
  }
  return result;
}

export function groupEntriesByContractType(
  entries: Array<{ is_gph_contract: boolean; gross_salary: string; net_salary: string }>,
): GroupedEntryData[] {
  const regular = { count: 0, gross: 0, net: 0 };
  const gph = { count: 0, gross: 0, net: 0 };

  entries.forEach((entry) => {
    const target = entry.is_gph_contract ? gph : regular;
    target.count++;
    target.gross += toNumber(entry.gross_salary);
    target.net += toNumber(entry.net_salary);
  });

  const result: GroupedEntryData[] = [];
  if (regular.count > 0) {
    result.push({ key: "regular", labelKey: "reportingSection.group.regularContract", ...regular });
  }
  if (gph.count > 0) {
    result.push({ key: "gph", labelKey: "reportingSection.group.gphContract", ...gph });
  }
  return result;
}

