import { Skeleton } from "@/shared/ui";

export function CardSkeleton() {
  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
        <Skeleton width={32} height={32} circle />
        <Skeleton width={200} height={24} />
      </div>
      <div className="space-y-4">
        <Skeleton width="100%" height={60} />
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={60} />
      </div>
    </div>
  );
}

export function ReportsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {[1, 2, 3].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeaderSectionSkeleton() {
  return (
    <div className="p-5 border surface-base-stroke surface-tertiary-fill radius-lg mb-6">
      <div className="mb-4">
        <Skeleton width={150} height={20} className="mb-2" />
        <Skeleton width={400} height={16} />
      </div>
      <div className="grid gap-4 grid-cols-[1fr_1fr_1fr]">
        <Skeleton width="100%" height={44} />
        <Skeleton width="100%" height={44} />
        <Skeleton width="100%" height={44} />
      </div>
    </div>
  );
}

export function DepreciationReportCardSkeleton() {
  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b surface-base-stroke">
        <Skeleton width={32} height={32} circle />
        <div className="flex flex-col gap-1">
          <Skeleton width={250} height={20} />
          <Skeleton width={300} height={16} />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_3fr] gap-6">
        <Skeleton width="100%" height={200} />
        <div className="flex flex-col gap-2">
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
          <Skeleton width="100%" height={40} />
        </div>
      </div>
    </div>
  );
}

export function CashFlowCardSkeleton() {
  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill p-5 mb-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </div>
  );
}

export function TableSectionSkeleton() {
  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill mb-6">
      <div className="p-5 border-b surface-base-stroke">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BreakdownSkeleton() {
  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill">
      <div className="p-5 border-b surface-base-stroke">
        <Skeleton className="h-6 w-48 mb-4" />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4">
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-1 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EntriesSkeleton() {
  return (
    <div className="radius-lg border surface-base-stroke surface-base-fill">
      <div className="p-5 border-b surface-base-stroke">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

