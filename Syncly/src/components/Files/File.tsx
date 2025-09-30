import Icon from "../../shared/ui/Icon";
import { useState, useRef, useEffect } from "react";
import { TFilesType, TUser } from "../../shared/type/FilesType";
import FileInput from "./FileInput";
import { useFileContext } from "../../context/FileContext";
import {
  DeleteFolder,
  PatchFolderName,
} from "../../shared/api/Folder/delete_patch";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  PatchFileName,
  DeleteFile,
  PostFileRestore,
} from "../../shared/api/File";
import { useShowImage } from "../../hooks/useShowImage";
import { PostFolderRestore } from "../../shared/api/Folder/post";

type TTypeProps = {
  type: TFilesType;
};
interface IFileProps extends TTypeProps {
  title: string;
  date: string;
  user?: TUser;
  fileId?: number;
  folderListRefetch?: () => void;
  trash?: boolean;
}

const File = ({
  type,
  title,
  date,
  user,
  fileId,
  folderListRefetch = () => {},
  trash = false,
}: IFileProps) => {
  const [modalShow, setModalShow] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { setFolderId, setFolderPath, folderPath } = useFileContext();
  const { id } = useParams();
  const workspaceId = Number(id);

  setFolderId(fileId as number);

  // 파일 확장자에 따른 타입 결정
  const getFileTypeFromExtension = (filename: string): TFilesType => {
    const extension = filename.split(".").pop()?.toLowerCase();

    if (!extension) return type; // 확장자가 없으면 원래 타입 유지

    const imageExtensions = ["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp"];
    const videoExtensions = [
      "mp4",
      "mov",
      "avi",
      "wmv",
      "flv",
      "mkv",
      "webm",
      "3gp",
    ];
    const documentExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "rtf",
    ];

    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    } else if (documentExtensions.includes(extension)) {
      return "file";
    }

    return type;
  };

  const finalType = getFileTypeFromExtension(title);

  const { mutate: patchFolderMutation } = useMutation({
    mutationFn: PatchFolderName,
    onSuccess: () => {
      console.log("폴더 이름 변경 성공");
      setEditTitle(false);
      folderListRefetch?.();
    },
    onError: (e) => {
      console.log("폴더 이름 변경 실패", e);
      setEditTitle(false);
    },
  });
  const { mutate: patchFileMutation } = useMutation({
    mutationFn: PatchFileName,
    onSuccess: () => {
      console.log("파일 이름 변경 성공");
      setEditTitle(false);
      folderListRefetch?.();
    },
    onError: (e) => {
      console.log("파일 이름 변경 실패", e);
      setEditTitle(false);
    },
  });

  const handleEditTitle = (text: string) => {
    if (!text.trim()) return;
    if (fileId) {
      if (type === "folder") {
        patchFolderMutation({
          workspaceId: workspaceId,
          folderId: fileId,
          name: text,
        });
      } else {
        patchFileMutation({
          workspaceId: workspaceId,
          fileId: fileId,
          name: text,
        });
      }
    }
  };

  const handleDeleteFolder = () => {
    if (type === "folder") {
      DeleteFolder({
        workspaceId: workspaceId,
        folderId: fileId as number,
      });
    } else {
      DeleteFile({
        workspaceId: workspaceId,
        fileId: fileId as number,
      });
    }
  };

  const handleRestoreFolder = () => {
    if (type === "folder") {
      PostFolderRestore({
        workspaceId: workspaceId,
        folderId: fileId as number,
      });
    } else {
      PostFileRestore({
        workspaceId: workspaceId,
        fileId: fileId as number,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        modalShow &&
        !modalRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setModalShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalShow]);

  const handleFolderClick = () => {
    if (type === "folder") {
      setFolderId(fileId as number);
      setFolderPath(new Map([...folderPath, [fileId as number, title]]));
      folderListRefetch();
    }
  };

  const profileImageUrl = useShowImage(user?.profileUrl || null);
  return (
    <>
      {editTitle ? (
        <FileInput
          type={finalType}
          onAdd={handleEditTitle}
          onCancel={() => setEditTitle(false)}
          initialValue={title}
          user={"userProfile"}
          folderListRefetch={folderListRefetch}
        />
      ) : (
        <div
          className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0] hover:cursor-pointer"
          onClick={handleFolderClick}
        >
          <Icon name={finalType} />
          <p className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold">
            {title}
          </p>
          <p className="text-[#828282]">{date}</p>
          {!profileImageUrl ? (
            <Icon name="User_Default" />
          ) : (
            <img
              src={profileImageUrl ?? undefined}
              alt="profile"
              className="w-[24px] h-[24px] rounded-full"
            />
          )}
          <div className="relative">
            <button
              className="cursor-pointer"
              onClick={() => setModalShow(true)}
            >
              <Icon name="more-horizontal" />
            </button>

            {modalShow &&
              (trash ? (
                <div
                  className="z-10 w-[160px] absolute top-0 right-[30px] flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
                  ref={modalRef}
                >
                  <p
                    className="text-[#828282] cursor-pointer flex-nowrap"
                    onClick={() => {
                      handleRestoreFolder();
                    }}
                  >
                    복원하기
                  </p>
                  <p
                    className="text-[#828282] cursor-pointer flex-nowrap"
                    onClick={() => {}}
                  >
                    완전 삭제
                  </p>
                </div>
              ) : (
                <div
                  className="z-10 w-[160px] absolute top-0 right-[30px] flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
                  ref={modalRef}
                >
                  <p className="text-[#828282] cursor-pointer flex-nowrap">
                    다운로드
                  </p>
                  <p
                    className="text-[#828282] cursor-pointer flex-nowrap"
                    onClick={() => setEditTitle(true)}
                  >
                    이름 변경
                  </p>
                  <p
                    className="text-[#828282] cursor-pointer flex-nowrap"
                    onClick={() => {
                      handleDeleteFolder();
                    }}
                  >
                    휴지통으로 이동
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
export default File;
