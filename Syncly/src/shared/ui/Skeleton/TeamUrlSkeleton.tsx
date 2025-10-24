import Skeleton from "./Skeleton";

export default function MyUrlSkeleton() {
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      {/* 상단 탭 + 버튼 */}
      <div className="w-full flex justify-between mt-5">
        {/* url, file 선택 버튼 */}
        <div className="flex items-center gap-0">
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
        </div>
        {/* 맨 위 + 버튼 */}
        <Skeleton width="w-12" height="h-10" rounded="rounded-lg" />
      </div>

      {/* URL 그룹 카드 3개 정도 */}
      <div className="flex flex-col gap-5 w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-lg shadow-md border border-neutral-200 p-6"
          >
            {/* 카드 헤더 */}
            <div className="flex justify-between items-center mb-8">
              <Skeleton width="w-64" height="h-7" /> {/* 제목 */}
              <div className="flex gap-4">
                <Skeleton width="w-10" height="h-10" rounded="rounded-md" /> {/* + */}
                <Skeleton width="w-24" height="h-10" rounded="rounded-md" /> {/* Save Tabs */}
                <Skeleton width="w-24" height="h-10" rounded="rounded-md" /> {/* Open Links */}
              </div>
            </div>

            {/* Source 텍스트 */}
            <Skeleton width="w-32" height="h-5" className="mb-6" />

            {/* URL 리스트 (2~3개) */}
            <div className="flex flex-col gap-5">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="flex justify-between items-center border-t border-neutral-200 pt-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Skeleton width="w-5" height="h-5" rounded="rounded-full" />
                    <Skeleton width="w-3/4" height="h-5" />
                  </div>
                  <Skeleton width="w-5" height="h-5" rounded="rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
