import { forwardRef, useEffect, useState } from "react";
import { TFilesType } from "../../shared/type/FilesType";

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TFilesType;
  trash?: boolean;
  onDownload?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onDeletePermanently?: () => void;
}

const FileModal = forwardRef<HTMLDivElement, FileModalProps>(
  (
    {
      isOpen,
      onClose,
      type,
      trash = false,
      onDownload,
      onRename,
      onDelete,
      onRestore,
      onDeletePermanently,
    },
    ref
  ) => {
    const [position, setPosition] = useState({ top: 0, right: 0 });

    useEffect(() => {
      if (isOpen && ref && "current" in ref && ref.current) {
        const modalElement = ref.current;

        // 버튼의 위치를 기준으로 모달 위치 계산
        const buttonRect = modalElement.parentElement?.getBoundingClientRect();
        if (buttonRect) {
          setPosition({
            top: buttonRect.bottom - 20,
            right: window.innerWidth - buttonRect.right + 10,
          });
        }
      }
    }, [isOpen, ref]);

    if (!isOpen) return null;

    return (
      <div
        className="z-50 w-[160px] fixed flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0] shadow-lg"
        ref={ref}
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        {trash ? (
          // 휴지통 모달
          <>
            <p
              className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#181818]"
              onClick={() => {
                onRestore?.();
                onClose();
              }}
            >
              복원하기
            </p>
            <p
              className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#F45B69] hover:font-bold"
              onClick={() => {
                onDeletePermanently?.();
                onClose();
              }}
            >
              완전 삭제
            </p>
          </>
        ) : (
          // 일반 모달
          <>
            {type !== "folder" && (
              <p
                className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#181818]"
                onClick={() => {
                  onDownload?.();
                  onClose();
                }}
              >
                다운로드
              </p>
            )}
            <p
              className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#181818]"
              onClick={() => {
                onRename?.();
                onClose();
              }}
            >
              이름 변경
            </p>
            <p
              className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#F45B69] hover:font-bold"
              onClick={() => {
                onDelete?.();
                onClose();
              }}
            >
              휴지통으로 이동
            </p>
          </>
        )}
      </div>
    );
  }
);

FileModal.displayName = "FileModal";

export default FileModal;
