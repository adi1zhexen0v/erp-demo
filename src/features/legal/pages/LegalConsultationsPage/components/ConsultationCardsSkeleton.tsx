import { Skeleton } from "@/shared/ui";

export default function ConsultationCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-7">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-5 radius-lg border surface-base-stroke surface-base-fill p-5">
          <div className="flex flex-col gap-2">
            <Skeleton height={24} width={140} borderRadius={6} />
            <Skeleton height={20} width={160} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="py-3 border-b border-t surface-base-stroke flex flex-col gap-1.5">
              <Skeleton height={14} width={80} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={120} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton height={14} width={120} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={100} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton height={14} width={140} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={150} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-3 border-t surface-base-stroke">
              <Skeleton height={14} width={80} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={100} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton height={14} width={60} />
              <div className="flex items-center gap-1.5">
                <Skeleton circle width={16} height={16} />
                <Skeleton height={16} width={200} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton height={40} width={"100%"} borderRadius={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
