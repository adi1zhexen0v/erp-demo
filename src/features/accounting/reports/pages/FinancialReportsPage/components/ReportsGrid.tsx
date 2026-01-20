import type { ReactNode } from "react";

interface ReportsGridProps {
  children: ReactNode;
}

export default function ReportsGrid({ children }: ReportsGridProps) {
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">{children}</div>;
}
