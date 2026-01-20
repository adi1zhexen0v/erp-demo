import { Skeleton } from "@/shared/ui";

export default function EmployeesSummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-[280fr_280fr_531fr] gap-2 my-7">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-5 radius-lg border surface-base-stroke surface-base-fill flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton circle width={32} height={32} />
            <Skeleton height={16} width={120} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Skeleton height={32} width={100} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

