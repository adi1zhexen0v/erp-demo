import { Skeleton } from "@/shared/ui";

export default function CasesCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7">
      {Array.from({ length: 1 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
          <Skeleton height={24} width={120} borderRadius={6} />

          <div className="flex flex-col gap-2">
            <Skeleton height={20} width={180} />
            <Skeleton height={16} width={240} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
              <Skeleton height={14} width={80} />
              <Skeleton height={24} width={100} borderRadius={6} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton height={14} width={100} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={100} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton height={40} width={"100%"} borderRadius={12} />
            <Skeleton height={40} width={"100%"} borderRadius={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
