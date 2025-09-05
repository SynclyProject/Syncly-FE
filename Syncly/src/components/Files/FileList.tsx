import FilesData from "../../shared/api/mock/Files";
import File from "./File";
import { TFilesType, TFiles } from "../../shared/type/FilesType";
import FileInput from "./FileInput";
import { useState } from "react";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { PostFolder } from "../../shared/api/Folder";
import { useMutation } from "@tanstack/react-query";

interface IFileListProps {
  searchValue: string;
  setShowInput: (boolean: boolean) => void;
  showInput: boolean;
  sort: boolean;
  type: "my" | "team";
}

const FileList = ({
  searchValue,
  setShowInput,
  showInput,
  sort,
  type,
}: IFileListProps) => {
  const [fileList, setFileList] = useState<TFiles[]>(FilesData);
  const filteredFiles = fileList.filter((file) =>
    file.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  const { workspaceId, personalSpaceId } = useWorkSpaceContext();
  const spaceId = type === "my" ? personalSpaceId : workspaceId;

  const filesToShow = searchValue ? filteredFiles : fileList;
  const noDataMessage = searchValue
    ? "검색된 파일이 없습니다."
    : "저장한 파일이 없습니다.";

  const { mutate: postFolderMutation } = useMutation({
    mutationFn: PostFolder,
    onSuccess: () => {
      console.log("폴더 생성 성공");
      // refetch();
    },
  });
  const handleAddFolder = (text: string) => {
    if (!text.trim()) return;

    postFolderMutation({
      workspaceId: spaceId,
      parentId: null,
      name: text,
    });
    // setFileList([...fileList, newFile]);
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
          {[...fileList]
            .sort((a, b) =>
              a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            )
            .map((file) => (
              <File
                key={file.id}
                type={file.type as TFilesType}
                title={file.title}
                date={file.date}
                user={file.user}
                fileId={file.id}
                setFileList={setFileList}
              />
            ))}
        </div>
      ) : filesToShow.length > 0 ? (
        filesToShow.map((file) => (
          <File
            key={file.id}
            type={file.type as TFilesType}
            title={file.title}
            date={file.date}
            user={file.user}
            fileId={file.id}
            setFileList={setFileList}
          />
        ))
      ) : (
        <p className="h-[56px] flex items-center justify-center text-[16px] font-semibold text-[#828282] border-t border-t-[#E0E0E0]">
          {noDataMessage}
        </p>
      )}

      {showInput && (
        <FileInput
          type="folder"
          user={"userProfile"}
          onAdd={handleAddFolder}
          onCancel={() => setShowInput(false)}
        />
      )}
    </div>
  );
};

export default FileList;
