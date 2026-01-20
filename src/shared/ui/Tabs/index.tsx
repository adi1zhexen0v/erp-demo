import cn from "classnames";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-6 border-b border-alpha-black-10", className)}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "py-2 text-grey-400 text-label-sm cursor-pointer flex items-center gap-2 transition-colors",
              isActive && "content-action-brand border-b-2 background-brand-stroke",
            )}>
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
