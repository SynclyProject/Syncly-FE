import File from "./File";
import { TFilesType, TFiles } from "../../shared/type/FilesType";
import FileInput from "./FileInput";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { PostFolder } from "../../shared/api/Folder/post";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetFolderFileList, GetRootFolder } from "../../shared/api/Folder/get";
import { useParams } from "react-router-dom";
import { useFileContext } from "../../context/FileContext";
import { useEffect } from "react";

interface IFileListProps {
  searchValue: string;
  setShowInput: (boolean: boolean) => void;
  showInput: boolean;
  sort: boolean;
  type?: "my" | "team";
}

const FileList = ({
  searchValue,
  setShowInput,
  showInput,
  sort,
  type = "my",
}: IFileListProps) => {
  const { personalSpaceId } = useWorkSpaceContext();
  const { id } = useParams();
  const spaceId = type === "my" ? personalSpaceId : Number(id);

  const isSpaceIdReady = typeof spaceId === "number" && !Number.isNaN(spaceId);

  const { data: rootFolder, isPending } = useQuery({
    queryKey: ["rootFolder", spaceId],
    queryFn: () => GetRootFolder({ workspaceId: spaceId }),
    enabled: isSpaceIdReady,
  });

  const rootFolderId = rootFolder?.result?.rootFolderId as number;
  const { folderId, setFolderId, setFolderPath } = useFileContext();

  // rootFolderId가 변경될 때만 folderPath를 업데이트
  useEffect(() => {
    if (rootFolderId) {
      setFolderPath(new Map([[rootFolderId, "Root"]]));
    }
  }, [rootFolderId, setFolderPath]);

  const selectedFolderId =
    typeof folderId === "number" && folderId > 0 ? folderId : rootFolderId;

  setFolderId(selectedFolderId);

  const { data: folderList, refetch: folderListRefetch } = useQuery({
    queryKey: ["folderList", spaceId, selectedFolderId],
    queryFn: () =>
      GetFolderFileList({
        workspaceId: spaceId,
        folderId: selectedFolderId as number,
      }),
    enabled: isSpaceIdReady && typeof selectedFolderId === "number",
  });

  const filteredFiles = folderList?.result?.items.filter((folder: TFiles) =>
    folder.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filesToShow = searchValue
    ? filteredFiles || []
    : folderList?.result?.items || [];

  const noDataMessage = searchValue
    ? "검색된 파일이 없습니다."
    : "저장한 파일이 없습니다.";

  const { mutate: postFolderMutation } = useMutation({
    mutationFn: PostFolder,
    onSuccess: () => {
      console.log("폴더 생성 성공");
      folderListRefetch();
    },
  });
  const handleAddFolder = (text: string) => {
    if (!text.trim()) return;

    postFolderMutation({
      workspaceId: spaceId,
      parentId: selectedFolderId,
      name: text,
    });
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-[8px] px-5">
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="text-[16px] font-semibold text-[#828282]">Type</p>
        <p className="flex-1 text-[16px] font-semibold">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold pr-[80px]">User</p>
      </div>
      {isPending && (
        //나중에 스켈레톤 UI (컴포넌트 제작) 삽입
        <div className="w-full h-[56px] bg-gray-200 flex items-center gap-[63px] border-t border-t-[#E0E0E0]"></div>
      )}
      {sort ? (
        <div>
          {[...filesToShow]
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
            .map((file: TFiles) => (
              <File
                key={file.id}
                type={file.type.toLowerCase() as TFilesType}
                title={file.name}
                date={file.date}
                user={file.user}
                fileId={file.id}
                folderListRefetch={folderListRefetch}
                trash={false}
              />
            ))}
        </div>
      ) : filesToShow.length > 0 ? (
        filesToShow.map((file: TFiles) => (
          <File
            key={file.id}
            type={file.type.toLowerCase() as TFilesType}
            title={file.name}
            date={file.date}
            user={file.user}
            fileId={file.id}
            folderListRefetch={folderListRefetch}
            trash={false}
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
          folderListRefetch={folderListRefetch}
        />
      )}
    </div>
  );
};

export default FileList;
