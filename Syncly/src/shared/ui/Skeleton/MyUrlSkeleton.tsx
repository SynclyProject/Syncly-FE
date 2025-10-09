
import Skeleton from "./Skeleton";

export default function UrlPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* 상단 제목 + 버튼 */}
      <div className="flex justify-between items-center">
        {/* 폴더명 */}
        <Skeleton width="w-32" height="h-6" />
        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <Skeleton width="w-20" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-24" height="h-8" rounded="rounded-md" />
        </div>
      </div>

      {/* URL 리스트 */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center border p-3 rounded-lg"
          >
            <div className="flex items-center gap-3 w-full">
              <Skeleton width="w-5" height="h-5" rounded="rounded-full" />
              <Skeleton width="w-3/4" height="h-4" />
            </div>
            <Skeleton width="w-5" height="h-5" rounded="rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
