import { Badge } from "@/shared/ui";
import type { PayrollStatus } from "@/features/accounting/payroll";
import { getPayrollStatusConfig, PAYROLL_STATUS_LABEL_KEYS } from "@/features/accounting/shared";

interface Props {
  status: PayrollStatus;
  t: (key: string) => string;
}

export default function StatusBadge({ status, t }: Props) {
  const { color, icon } = getPayrollStatusConfig(status);

  return <Badge variant="soft" color={color} text={t(PAYROLL_STATUS_LABEL_KEYS[status])} icon={icon} />;
}
