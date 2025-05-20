import FilesData from "../../shared/api/mock/Files";
import File from "./File";
import { TFilesType } from "../../shared/type/FilesType";
// import Icon from "../../shared/ui/Icon";
const FileList = ({ searchValue }: { searchValue: string }) => {
  const filteredFiles = FilesData.filter((file) =>
    file.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filesToShow = searchValue ? filteredFiles : FilesData;
  const noDataMessage = searchValue
    ? "검색된 파일이 없습니다."
    : "저장한 파일이 없습니다.";

  return (
    <div className="flex flex-col w-full bg-white rounded-[8px] px-5">
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="text-[16px] font-semibold text-[#828282]">Type</p>
        <p className="flex-1 text-[16px] font-semibold">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold pr-[80px]">User</p>
      </div>
      {filesToShow.length > 0 ? (
        filesToShow.map((file) => (
          <File
            key={file.id}
            type={file.type as TFilesType}
            title={file.title}
            date={file.date}
            user={file.user}
          />
        ))
      ) : (
        <p className="h-[56px] flex items-center justify-center text-[16px] font-semibold text-[#828282] border-t border-t-[#E0E0E0]">
          {noDataMessage}
        </p>
      )}
      {/* {FilesData.map((file) => (
        <File
          key={file.id}
          type={file.type as TFilesType}
          title={file.title}
          date={file.date}
          user={file.user}
        />
      ))} */}
    </div>
  );
};

export default FileList;
