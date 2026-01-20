import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Profile2User, Box, Profile } from "iconsax-react";
import { Table } from "@/shared/ui";
import { formatMoneyKzt } from "@/features/accounting/shared";
import type { WarehouseGroup } from "../../../hooks";

interface Props {
  groups: WarehouseGroup[];
  onGroupSelect: (groupName: string) => void;
}

export default function WarehouseGroupsTable({ groups, onGroupSelect }: Props) {
  const { t } = useTranslation("WarehousePage");

  return (
    <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
      <div className="flex items-center gap-3">
        <div className="w-10 aspect-square radius-xs surface-component-fill content-action-neutral flex items-center justify-center">
          <Profile2User size={24} color="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-bold-lg content-base-primary">{t("section.title")}</h3>
          <p className="text-body-regular-sm content-action-neutral">{t("section.groupsSubtitle")}</p>
        </div>
      </div>

      <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell>{t("table.groupName")}</Table.HeadCell>
            <Table.HeadCell>{t("table.quantity")}</Table.HeadCell>
            <Table.HeadCell>{t("table.totalAmount")}</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {groups.map((group, index) => {
            const isEven = index % 2 === 0;
            const avatarBg = isEven ? "bg-grey-50 dark:bg-grey-900" : "bg-white dark:bg-grey-950";

            return (
              <Table.Row
                key={group.groupName}
                onClick={() => onGroupSelect(group.groupName)}
                className="cursor-pointer hover:surface-component-hover transition-colors">
                <Table.Cell isBold>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-7 aspect-square radius-xs content-action-neutral flex items-center justify-center",
                        avatarBg,
                      )}>
                      {group.groupName === t("groups.unassigned") ? (
                        <Box size={16} color="currentColor" />
                      ) : (
                        <Profile size={16} color="currentColor" />
                      )}
                    </div>
                    <span>{group.groupName}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{group.count}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-label-sm content-base-primary">{formatMoneyKzt(group.totalAmount)}</span>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Table>
    </div>
  );
}
