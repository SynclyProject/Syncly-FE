import Skeleton from "./Skeleton";

type MyFilesSkeletonProps = {
  rows?: number; // 테이블에 표시할 스켈레톤 행 개수
};

export default function MyFilesSkeleton({ rows = 6 }: MyFilesSkeletonProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 중앙 컨테이너 */}
      <div className="w-full max-w-[880px] mx-auto px-6 md:px-8 lg:px-10 py-5 animate-pulse">

        {/* 탭 + 우측 + 버튼 */}
        <div className="flex w-full justify-between items-center mb-6">
          <div className="flex items-center gap-2 p-1 rounded-lg bg-neutral-100">
            <Skeleton width="w-44" height="h-8" rounded="rounded-md" /> {/* URLs */}
            <Skeleton width="w-44" height="h-8" rounded="rounded-md" /> {/* Files */}
          </div>
          <Skeleton width="w-10" height="h-10" rounded="rounded-md" />     {/* + */}
        </div>

        {/* 툴바: 검색 / 필터 / 삭제 / 우측 옵션 */}
        <div className="flex w-full items-center gap-3 mb-5">
          <Skeleton width="w-96" height="h-10" rounded="rounded-md" />     {/* Search files... */}
          <Skeleton width="w-24" height="h-10" rounded="rounded-md" />     {/* Filter */}
          <Skeleton width="w-10" height="h-10" rounded="rounded-md" />     {/* Delete */}
          <div className="ml-auto flex items-center gap-2">
            <div className="p-1 rounded-lg bg-neutral-100 flex items-center gap-2">
              <Skeleton width="w-20" height="h-8" rounded="rounded-md" />   {/* 정렬 */}
              <Skeleton width="w-20" height="h-8" rounded="rounded-md" />   {/* 사용자 */}
            </div>
            <div className="p-1 rounded-lg bg-neutral-100">
              <Skeleton width="w-24" height="h-8" rounded="rounded-md" />   {/* 폴더/파일 메뉴 */}
            </div>
          </div>
        </div>

        {/* 테이블 카드 */}
        <div className="w-full bg-white rounded-lg border border-neutral-200">
          {/* 헤더 */}
          <div className="flex items-center gap-6 px-3 h-14">
            <Skeleton width="w-14" height="h-5" />                         {/* Type */}
            <Skeleton width="w-64" height="h-5" />                         {/* Title */}
            <Skeleton width="w-16" height="h-5" className="ml-auto" />     {/* Date */}
            <Skeleton width="w-24" height="h-5" />                         {/* User */}
          </div>

          {/* 행들 */}
          <div className="divide-y divide-neutral-200">
            {Array.from({ length: rows }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-6 px-3 h-14">
                <Skeleton width="w-6" height="h-6" rounded="rounded-sm" />  {/* Type 아이콘 */}
                <Skeleton width="w-[55%]" height="h-5" />                   {/* Title */}
                <Skeleton width="w-16" height="h-5" className="ml-auto" />  {/* Date */}
                <Skeleton width="w-7" height="h-7" rounded="rounded-full" />{/* User 아바타 */}
                <Skeleton width="w-5" height="h-5" rounded="rounded-sm" />  {/* More */}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
