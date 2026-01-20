import { Skeleton } from "@/shared/ui";

export default function TaxFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Skeleton height={40} width={40} borderRadius={8} />
        <div>
          <Skeleton height={20} width={200} className="mb-1" />
          <Skeleton height={14} width={300} />
        </div>
      </div>

      <div className="border surface-base-stroke radius-lg overflow-hidden">
        <div className="p-4 border-b surface-base-stroke">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={16} width={100} />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 border-b surface-base-stroke last:border-b-0">
            <div className="grid grid-cols-4 gap-4 items-center">
              <Skeleton height={14} width={120} />
              <Skeleton height={14} width={200} />
              <Skeleton height={14} width={100} />
              <Skeleton height={14} width={150} className="ml-auto" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton height={18} width={150} />
        <div className="border surface-base-stroke radius-lg overflow-hidden">
          <div className="p-4 border-b surface-base-stroke">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} height={16} width={100} />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border-b surface-base-stroke last:border-b-0">
              <div className="grid grid-cols-3 gap-4">
                <Skeleton height={14} width={100} />
                <Skeleton height={14} width={80} />
                <Skeleton height={14} width={120} className="ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

