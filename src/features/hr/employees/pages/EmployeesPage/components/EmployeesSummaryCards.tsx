import { useTranslation } from "react-i18next";
import { Profile2User } from "iconsax-react";
import { TengeSign } from "@/shared/assets/icons";
import { formatPrice } from "@/shared/utils";

interface Props {
  totalEmployees: number;
  activeEmployees: number;
  totalSalary: number;
}

export default function EmployeesSummaryCards({ totalEmployees, activeEmployees, totalSalary }: Props) {
  const { t } = useTranslation("EmployeesPage");

  const cards = [
    {
      label: t("summary.totalEmployees"),
      value: formatPrice(totalEmployees),
    },
    {
      label: t("summary.activeEmployees"),
      value: formatPrice(activeEmployees),
    },
    {
      label: t("summary.fund"),
      value: formatPrice(totalSalary),
      isMoney: true,
    },
  ];

  return (
    <div className="grid grid-cols-[280fr_280fr_531fr] gap-2 my-7">
      {cards.map((c, i) => (
        <div key={i} className="p-5 radius-lg border surface-base-stroke surface-base-fill flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 aspect-square flex justify-center items-center surface-secondary-fill content-base-secondary radius-xs">
              <Profile2User size={16} color="currentColor" />
            </div>
            <p className="text-label-sm content-base-primary">{c.label}</p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h6 className="flex items-end text-display-md content-base-primary">
                {c.value}
                {c.isMoney && <TengeSign />}
              </h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

