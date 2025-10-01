import File from "./File";
import { TFilesType, TFiles } from "../../shared/type/FilesType";
import FileInput from "./FileInput";
import { GetTrashFolder } from "../../shared/api/Folder/get";
import { useQuery } from "@tanstack/react-query";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { useParams } from "react-router-dom";

interface IFileListProps {
  searchValue: string;
  setShowInput: (boolean: boolean) => void;
  showInput: boolean;
  sort: boolean;
  type: "my" | "team";
}

const TrashFileList = ({
  searchValue,
  setShowInput,
  showInput,
  sort,
  type,
}: IFileListProps) => {
  const { personalSpaceId } = useWorkSpaceContext();
  const { id } = useParams();
  const spaceId = type === "my" ? personalSpaceId : Number(id);

  const { data: trashFolderList } = useQuery({
    queryKey: ["trashFolderList", spaceId],
    queryFn: () => GetTrashFolder({ workspaceId: spaceId }),
  });
  const filteredFiles = trashFolderList?.result?.items.filter((file: TFiles) =>
    file.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filesToShow = searchValue
    ? filteredFiles
    : trashFolderList?.result?.items;
  const noDataMessage = searchValue
    ? "검색된 파일이 없습니다."
    : "빈 휴지통입니다.";

  const handleAddFile = (text: string) => {
    if (!text.trim()) return;
    //완전 삭제 API가 들어가야 하나?
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-[8px] px-5">
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="text-[16px] font-semibold text-[#828282]">Type</p>
        <p className="flex-1 text-[16px] font-semibold">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold pr-[80px]">User</p>
      </div>
      {sort ? (
        <div>
          {[...(trashFolderList?.result?.items || [])]
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            .map((file) => (
              <File
                key={file.id}
                type={file.type.toLowerCase() as TFilesType}
                title={file.name}
                date={file.date}
                user={file.user}
                folderListRefetch={() => {}}
                trash={true}
              />
            ))}
        </div>
      ) : filesToShow?.length > 0 ? (
        filesToShow.map((file: TFiles) => (
          <File
            key={file.id}
            type={file.type.toLowerCase() as TFilesType}
            title={file.name}
            date={file.date}
            user={file.user}
            folderListRefetch={() => {}}
            trash={true}
          />
        ))
      ) : (
        <p className="h-[56px] flex items-center justify-center text-[16px] font-semibold text-[#828282] border-t border-t-[#E0E0E0]">
          {noDataMessage}
        </p>
      )}

      {showInput && (
        <FileInput
          user={"userProfile"}
          onAdd={handleAddFile}
          onCancel={() => setShowInput(false)}
          type="folder"
          folderListRefetch={() => {}}
        />
      )}
    </div>
  );
};

export default TrashFileList;
