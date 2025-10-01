import Button from "../../shared/ui/Button";
import { useRef, useState, useEffect } from "react";
import AddFile from "./AddFile";
import { useFileContext } from "../../context/FileContext";

const FilePath = ({
  setShowInput,
  type,
  trash,
}: {
  setShowInput: (boolean: boolean) => void;
  type: "my" | "team";
  trash: boolean;
}) => {
  const [filePlusModal, setFilePlusModal] = useState(false);
  const [addFileModal, setAddFileModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { folderPath, setFolderId, setFolderPath } = useFileContext();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        filePlusModal &&
        !modalRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setFilePlusModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filePlusModal]);

  const handlePathClick = (clickedKey: number) => {
    setFolderId(clickedKey);

    const nextPath = new Map<number, string>();
    for (const [k, v] of folderPath.entries()) {
      nextPath.set(k, v);
      if (k === clickedKey) break;
    }
    setFolderPath(nextPath);
  };

  return (
    <div className="w-full flex justify-between items-center mt-5">
      <div className="flex items-center gap-[50px]">
        <div className="flex items-center gap-3">
          {trash && (
            <p className="font-medium text-[32px] overflow-hidden overflow-ellipsis">
              (휴지통)
            </p>
          )}
          {Array.from(folderPath.entries()).map(([key, value], idx, arr) => (
            <p
              key={key}
              className="font-medium text-[32px] overflow-hidden overflow-ellipsis"
            >
              <span
                className="hover:cursor-pointer hover:bg-[#DEE4ED] hover:px-2 hover:py-1 hover:rounded-[8px]"
                onClick={() => handlePathClick(key)}
              >
                {value}
              </span>
              {idx < arr.length - 1 ? " > " : ""}
            </p>
          ))}
        </div>
      </div>
      <div className="relative">
        <Button
          colorType="main"
          iconName="add_circle"
          onClick={() => setFilePlusModal(true)}
        />
        {filePlusModal && (
          <div
            className="absolute bottom-[-105px] right-0 flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
            ref={modalRef}
          >
            <p
              className="text-[#828282] cursor-pointer flex-nowrap"
              onClick={() => setShowInput(true)}
            >
              폴더 생성
            </p>
            <p
              className="text-[#828282] cursor-pointer flex-nowrap"
              onClick={() => setAddFileModal(true)}
            >
              파일 추가
            </p>
          </div>
        )}
        {addFileModal && (
          <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50">
            <AddFile setAddFileModal={setAddFileModal} type={type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePath;
