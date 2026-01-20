import { Skeleton } from "@/shared/ui";

export function FinancePageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton height={24} width={200} className="mb-2" />

      <div className="grid grid-cols-[1fr_2fr] gap-5">
        <div className="flex flex-col gap-5 border p-5 radius-lg surface-base-stroke">
          <div className="flex items-center gap-3 pb-3 border-b surface-base-stroke">
            <Skeleton circle width={32} height={32} />
            <Skeleton height={20} width={200} />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="radius-lg surface-component-fill p-5 flex flex-col gap-1">
                <Skeleton height={16} width={120} />
                <Skeleton height={28} width={150} />
              </div>
            ))}
          </div>
        </div>

        <div className="radius-lg border surface-base-stroke surface-base-fill p-5 flex flex-col">
          <div className="flex items-center gap-3 pb-3 border-b surface-base-stroke mb-6">
            <Skeleton circle width={32} height={32} />
            <Skeleton height={20} width={250} />
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-5 flex-1">
            <div className="relative flex flex-col items-center justify-center">
              <Skeleton circle width={300} height={300} />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 radius-md border surface-base-stroke">
                  <Skeleton circle width={16} height={16} />
                  <div className="flex-1">
                    <Skeleton height={16} width={150} className="mb-1" />
                    <Skeleton height={14} width={120} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="radius-lg border surface-base-stroke background-base-primary p-5">
        <div className="flex items-center justify-between gap-3 pb-3 border-b surface-base-stroke">
          <div className="flex items-center gap-3">
            <Skeleton circle width={32} height={32} />
            <div className="flex flex-col gap-1">
              <Skeleton height={20} width={150} />
              <Skeleton height={14} width={120} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton height={32} width={180} />
            <Skeleton height={14} width={200} />
          </div>
        </div>
        <div className="flex flex-col gap-5 mt-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Skeleton height={16} width={200} />
                <Skeleton height={20} width={120} />
              </div>
              <Skeleton height={16} width="100%" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

