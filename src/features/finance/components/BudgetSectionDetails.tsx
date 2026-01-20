import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown2, ArrowUp2, CardReceive, CardPos, CardSend, PercentageCircle } from "iconsax-react";
import { Table } from "@/shared/ui";
import { formatDateForDisplay } from "@/shared/utils";
import {
  formatCurrencyNoDecimals,
  formatAccountCode,
  formatPercentage,
  getLocalizedText,
  groupBudgetItems,
  calculateRemaining,
} from "../utils";
import type { BudgetSection } from "../types/api";

interface BudgetSectionDetailsProps {
  section: BudgetSection;
}

export function BudgetSectionDetails({ section }: BudgetSectionDetailsProps) {
  const { t, i18n } = useTranslation("FinancePage");
  const locale = i18n.language || "ru";
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(
    new Set(section.subcategories.length > 0 ? [section.subcategories[0].id] : []),
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  function toggleSubcategory(id: string) {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSubcategories(newExpanded);
  }

  function toggleGroup(groupId: string) {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  }

  const remainingNum = calculateRemaining(section.planned_total, section.total);
  const remainingIsNegative = remainingNum < 0;

  const cards = useMemo(
    () => [
      {
        key: "planned",
        label: t("section.planned"),
        value: formatCurrencyNoDecimals(section.planned_total),
        icon: CardPos,
        iconColor: "background-on-background-subtle-info content-action-info",
      },
      {
        key: "total",
        label: t("section.spent"),
        value: formatCurrencyNoDecimals(section.total),
        icon: CardReceive,
        iconColor: "background-on-background-subtle-notice content-action-notice",
      },
      {
        key: "remaining",
        label: t("section.remaining"),
        value: formatCurrencyNoDecimals(remainingNum.toString()),
        icon: CardSend,
        iconColor: remainingIsNegative
          ? "background-on-background-subtle-negative content-action-negative"
          : "background-on-background-subtle-positive content-action-positive",
      },
      {
        key: "execution",
        label: t("section.execution"),
        value: formatPercentage(section.execution_percentage),
        icon: PercentageCircle,
        iconColor: "background-on-background-subtle-info content-action-info",
      },
    ],
    [t, section.planned_total, section.total, section.execution_percentage, remainingNum, remainingIsNegative],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.key} className="p-5 radius-lg border surface-component-stroke flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-8 aspect-square flex justify-center items-center surface-component-fill radius-xs ${card.iconColor}`}>
                    <Icon size={16} color="currentColor" variant="Bold" />
                  </div>
                  <p className="text-label-sm content-base-primary">{card.label}</p>
                </div>
                <h6 className="text-display-sm content-base-primary">{card.value}</h6>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {section.subcategories.map((subcategory) => {
          const isExpanded = expandedSubcategories.has(subcategory.id);
          const hasItems = subcategory.items.length > 0;

          return (
            <div key={subcategory.id} className="border surface-base-stroke rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSubcategory(subcategory.id)}
                className="w-full flex items-center justify-between p-3 hover:surface-tertiary-fill transition-colors text-left cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-5">
                    <div className="text-body-bold-lg content-base-primary">
                      {getLocalizedText(subcategory.name, locale)}
                    </div>
                  </div>
                </div>
                <div className="flex item-center gap-5">
                  <div className="text-body-bold-lg content-base-primary">
                    {formatCurrencyNoDecimals(subcategory.total)}
                  </div>
                  <span className="content-base-primary mt-0.5">
                    {isExpanded ? (
                      <ArrowUp2 size={20} color="currentColor" />
                    ) : (
                      <ArrowDown2 size={20} color="currentColor" />
                    )}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 border-t surface-base-stroke">
                  {!subcategory.is_trackable ? (
                    <div className="text-body-regular-sm content-base-secondary text-center py-4">
                      {t("section.noExpenses")}
                    </div>
                  ) : hasItems ? (
                    <div className="flex flex-col gap-3">
                      <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
                        <div className="p-4 radius-md surface-component-fill flex flex-col gap-2">
                          <span className="text-body-regular-md content-base-primary pb-3 border-b surface-base-stroke">
                            {t("section.planned")}:
                          </span>
                          <p className="text-display-2xs content-base-primary">
                            {formatCurrencyNoDecimals(subcategory.planned)}
                          </p>
                        </div>

                        <div className="p-4 radius-md surface-component-fill flex flex-col gap-2">
                          <span className="text-body-regular-md content-base-primary pb-3 border-b surface-base-stroke">
                            {t("section.spent")}:
                          </span>
                          <p className="text-display-2xs content-action-negative">
                            {formatCurrencyNoDecimals(subcategory.total)}
                          </p>
                        </div>

                        <div className="p-4 radius-md surface-component-fill flex flex-col gap-2">
                          <span className="text-body-regular-md content-base-primary pb-3 border-b surface-base-stroke">
                            {t("section.remaining")}:
                          </span>
                          <p className="text-display-2xs content-action-positive">
                            {formatCurrencyNoDecimals(subcategory.remaining)}
                          </p>
                        </div>

                        <div className="p-4 radius-md surface-component-fill flex flex-col gap-2">
                          <span className="text-body-regular-md content-base-primary pb-3 border-b surface-base-stroke">
                            {t("section.execution")}:
                          </span>
                          <p className="text-display-2xs content-base-primary">
                            {formatPercentage(subcategory.execution_percentage)}
                          </p>
                        </div>
                      </div>

                      <p className="text-body-bold-lg content-base-primary mt-3">{t("section.itemsTableTitle")}</p>

                      <div className="overflow-x-auto">
                        <Table.Table>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeadCell>{t("table.name")}</Table.HeadCell>
                              <Table.HeadCell>{t("table.date")}</Table.HeadCell>
                              <Table.HeadCell>{t("table.account")}</Table.HeadCell>
                              <Table.HeadCell align="right">{t("table.amount")}</Table.HeadCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {(() => {
                              const groupedItems = groupBudgetItems(subcategory.items, locale);
                              return groupedItems.map((group) => {
                                const isGroupExpanded = expandedGroups.has(group.group_id);
                                return (
                                  <React.Fragment key={group.group_id}>
                                    <Table.Row
                                      onClick={() => toggleGroup(group.group_id)}
                                      className="cursor-pointer hover:surface-tertiary-fill">
                                      <Table.Cell>
                                        <div className="flex items-center gap-2">
                                          <span className="content-base-primary">
                                            {isGroupExpanded ? (
                                              <ArrowUp2 size={16} color="currentColor" />
                                            ) : (
                                              <ArrowDown2 size={16} color="currentColor" />
                                            )}
                                          </span>
                                          <span>{group.group_name}</span>
                                        </div>
                                      </Table.Cell>
                                      <Table.Cell colSpan={2}>{""}</Table.Cell>
                                      <Table.Cell align="right" isBold>
                                        {formatCurrencyNoDecimals(group.totalAmount)}
                                      </Table.Cell>
                                    </Table.Row>
                                    {isGroupExpanded &&
                                      group.items.map((item, idx) => (
                                        <Table.Row key={`${group.group_id}_${idx}`}>
                                          <Table.Cell className="pl-8">
                                            {getLocalizedText(item.name, locale)}
                                          </Table.Cell>
                                          <Table.Cell>{formatDateForDisplay(item.date, false)}</Table.Cell>
                                          <Table.Cell>{formatAccountCode(item.account)}</Table.Cell>
                                          <Table.Cell align="right" isBold>
                                            {formatCurrencyNoDecimals(item.amount)}
                                          </Table.Cell>
                                        </Table.Row>
                                      ))}
                                  </React.Fragment>
                                );
                              });
                            })()}
                          </Table.Body>
                        </Table.Table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-body-regular-sm content-action-neutral text-center py-4">
                      {t("section.noExpenses")}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

