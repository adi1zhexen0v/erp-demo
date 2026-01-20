import type { BudgetItem, BudgetSection } from "../types/api";
import { parseMoney } from "./format";
import { getLocalizedText } from "./localization";
import { getSectionColor } from "./consts";

export interface GroupedItem {
  group_id: string;
  group_name: string;
  items: BudgetItem[];
  totalAmount: string;
}

export function groupBudgetItems(items: BudgetItem[], locale: string): GroupedItem[] {
  const groupsMap = new Map<string, GroupedItem>();

  items.forEach((item) => {
    const groupId = item.group_id || `item_${item.source_id}_${item.date}`;
    const existingGroup = groupsMap.get(groupId);

    if (existingGroup) {
      existingGroup.items.push(item);
      const currentTotal = parseMoney(existingGroup.totalAmount);
      const itemAmount = parseMoney(item.amount);
      existingGroup.totalAmount = (currentTotal + itemAmount).toFixed(2);
    } else {
      const displayName = item.group_name 
        ? getLocalizedText(item.group_name, locale)
        : getLocalizedText(item.name, locale);
      
      groupsMap.set(groupId, {
        group_id: groupId,
        group_name: displayName,
        items: [item],
        totalAmount: item.amount,
      });
    }
  });

  return Array.from(groupsMap.values());
}

export interface PieChartData {
  name: string;
  value: number;
  section: BudgetSection;
  color: string;
  [key: string]: string | number | BudgetSection;
}

export function transformSectionsForPieChart(sections: BudgetSection[], isDark: boolean, locale: string): PieChartData[] {
  const totalPlanned = sections.reduce((sum, s) => sum + parseMoney(s.planned_total), 0);
  if (totalPlanned === 0) {
    return [];
  }

  return sections.map((section) => {
    const plannedAmount = parseMoney(section.planned_total);
    const color = getSectionColor(section.id, isDark);

    return {
      name: getLocalizedText(section.name, locale),
      value: plannedAmount,
      section,
      color,
    };
  });
}

