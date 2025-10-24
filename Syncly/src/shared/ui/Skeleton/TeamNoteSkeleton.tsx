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
        <p className="font-medium text-[32px]">Note</p>
      
      </div>

      {/* Search / Filter / Delete */}
      <div className="w-full flex items-center gap-5 pr-3">
        <Skeleton width="w-85" height="h-10" rounded="rounded-md" />   {/* Search files... */}
        <Skeleton width="w-33" height="h-10" rounded="rounded-md" />   {/* Filter */}
        <div className="w-full flex justify-end"><Skeleton width="w-12" height="h-10" rounded="rounded-lg" /></div> 
      </div>
      

      <div className="flex w-full h-full gap-5 pr-3">
        {/* 왼쪽 노트 리스트 영역 */}
        <div className="w-[50%] bg-white rounded-lg  p-4 flex flex-col">
            <div className="w-full h-[30px] bg-white flex items-center gap-[63px] mb-5">
            <div className="w-24 flex-1 mr-15">
                <Skeleton width="w-20" height="h-6" rounded="rounded-md" />
            </div>
            <div className="w-13 ml-[30px] text-right">
                <Skeleton width="w-14" height="h-6" rounded="rounded-md" />
            </div>
            <div className="w-30 text-right">
                <Skeleton width="w-14" height="h-6" rounded="rounded-md" />
            </div>

            </div>



            <div className="flex flex-col gap-2 overflow-y-auto">
            <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
            <Skeleton width="w-full" height="h-12" rounded="rounded-md" />
            </div>
        </div>

    {/* 오른쪽 상세 보기 영역 */}
    <div className="w-1/2 bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-center">
    <Skeleton
                width="w-full"
                height="h-full"        
                rounded="rounded-md"
              />
    </div>
    </div>

      
 



    </div>
  );
}
