import { Skeleton } from "@/shared/ui";

export default function RentalsPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-7">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] p-5 border surface-base-stroke surface-tertiary-fill gap-2 radius-lg">
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
      </div>

      <div className="flex flex-col gap-5 p-5 radius-lg border surface-component-stroke">
        <div className="flex items-center gap-3">
          <Skeleton width={40} height={40} className="radius-xs" />
          <div className="flex flex-col gap-0.5">
            <Skeleton width={120} height={20} />
            <Skeleton width={200} height={16} />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_96px] gap-4 pb-3 border-b surface-base-stroke">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={20} />
            ))}
          </div>

          <div className="flex flex-col gap-0">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_96px] gap-4 py-3 border-b surface-base-stroke">
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} height={20} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Skeleton width={200} height={20} />
        <div className="flex items-center gap-2">
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
        </div>
      </div>
    </div>
  );
}

