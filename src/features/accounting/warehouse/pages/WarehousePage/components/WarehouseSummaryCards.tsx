import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Box1, Archive, Profile2User, Building } from "iconsax-react";
import { TengeCircleIcon } from "@/shared/assets/icons";
import { formatMoneyKzt } from "@/features/accounting/shared";
import type { WarehouseSummary as Summary } from "../../../utils";

interface Props {
  summary: Summary;
}

export default function WarehouseSummaryCards({ summary }: Props) {
  const { t } = useTranslation("WarehousePage");

  const cards = [
    {
      key: "totalUnits",
      label: t("summary.totalUnits"),
      value: summary.totalUnits.toString(),
      icon: Box1,
      iconColor: "background-on-background-subtle-info content-action-info",
      isCustomIcon: false,
    },
    {
      key: "inStock",
      label: t("summary.inStock"),
      value: summary.inStockCount.toString(),
      icon: Archive,
      iconColor: "background-on-background-subtle-positive content-action-positive",
      isCustomIcon: false,
    },
    {
      key: "assigned",
      label: t("summary.assigned"),
      value: summary.assignedCount.toString(),
      icon: Profile2User,
      iconColor: "background-on-background-subtle-notice content-action-notice",
      isCustomIcon: false,
    },
    {
      key: "fixedAssets",
      label: t("summary.fixedAssets"),
      value: summary.fixedAssetsCount.toString(),
      icon: Building,
      iconColor: "background-on-background-subtle-negative content-action-negative",
      isCustomIcon: false,
    },
    {
      key: "totalValue",
      label: t("summary.totalValue"),
      value: formatMoneyKzt(summary.totalValue),
      icon: TengeCircleIcon,
      iconColor: "background-on-background-subtle-warning content-action-warning",
      isCustomIcon: true,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="p-5 radius-lg border surface-component-stroke flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "w-8 aspect-square flex justify-center items-center surface-component-fill radius-xs",
                  card.iconColor,
                )}>
                {card.isCustomIcon ? (
                  <Icon size={16} className="dark:text-white" />
                ) : (
                  <Icon size={16} color="currentColor" variant="Bold" />
                )}
              </div>
              <p className="text-label-sm content-base-primary">{card.label}</p>
            </div>

            <div className="flex flex-col gap-1">
              <h6 className="text-display-sm content-base-primary">{card.value}</h6>
            </div>
          </div>
        );
      })}
    </div>
  );
}

