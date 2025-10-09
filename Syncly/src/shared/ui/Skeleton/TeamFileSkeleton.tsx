import Skeleton from "./Skeleton";


export default function MyFilesSkeleton() {
  return (
    <div className="w flex flex-col items-center gap-5">
      
      {/* 파일 영역 */}
      <div className="w-full bg-white rounded-lg border border-neutral-200 p-4">
          
          
            {/* 파일 부분 */}
            <div className="p-4">
              <Skeleton
                width="w-full"
                height="h-[260px]"        // 필요에 따라 220~320px로 조절
                rounded="rounded-md"
              />
            </div>

          
      
      </div>


    </div>
  );
}
