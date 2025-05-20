import FilesData from "../../shared/api/mock/Files";
import File from "./File";
import { TFilesType } from "../../shared/type/FilesType";

const FileList = () => {
  return (
    <div className="flex flex-col w-full bg-white rounded-[8px] px-5">
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="text-[16px] font-semibold text-[#828282]">Type</p>
        <p className="flex-1 text-[16px] font-semibold">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold">User</p>
      </div>
      {FilesData.map((file) => (
        <File
          key={file.id}
          type={file.type as TFilesType}
          title={file.title}
          date={file.date}
          user={file.user}
        />
      ))}
    </div>
  );
};

export default FileList;
