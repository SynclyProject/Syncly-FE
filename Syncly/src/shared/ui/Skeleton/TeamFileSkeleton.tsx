import Skeleton from "./Skeleton";


export default function MyFilesSkeleton() {
  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      {/* 상단 탭 + 버튼 */}
      <div className="w-full flex justify-between mt-5">
        {/* url, file 선택 버튼 */}
        <div className="flex items-center gap-0 mb-5">
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
          <Skeleton width="w-44" height="h-8" rounded="rounded-md" />
        </div>
      </div>

      <div className="w-full flex flex-col gap-5">
        {/* 맨 위 + 버튼 */}
        <div className="w-full flex justify-end"><Skeleton width="w-12" height="h-10" rounded="rounded-lg" /></div> 
        
      
      </div>

      {/* Search / Filter / Delete */}
      <div className="w-full flex items-center gap-3">
        <Skeleton width="w-59" height="h-10" rounded="rounded-md" />   {/* Search files... */}
        <Skeleton width="w-23" height="h-10" rounded="rounded-md" />   {/* Filter */}
        <Skeleton width="w-11.5" height="h-10" rounded="rounded-md" />   {/* Delete */}
      </div>

      
      {/* 파일 영역 */}
      <div className="w-full bg-white rounded-lg border border-neutral-200 p-4">
          <div  className="flex items-center px-3 h-8 gap-3">
            {/* Type */}
            <div className="w-14">
              <Skeleton width="w-10" height="h-4" rounded="rounded-sm" />
            </div>

            {/* Title (가장 넓음) */}
            <div className="flex-1 min-w-0">
              <Skeleton width="w-40" height="h-4" rounded="rounded-sm" />
            </div>

            {/* Date (우측 정렬) */}
            <div className="w-24 ml-auto text-right">
              <Skeleton width="w-16" height="h-4" rounded="rounded-sm" />
            </div>

            {/* User */}
            <div className="w-24 text-center">
              <Skeleton width="w-14" height="h-4" rounded="rounded-sm" />
            </div>
          

          </div>
            <div className="border-t border-neutral-200" />

            {/* 파일 부분 */}
            <div className="p-4">
              <div className="flex flex-col gap-2 overflow-y-auto">
              <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
              <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
              </div>
            </div>

          
      </div>



    </div>
  );
}
