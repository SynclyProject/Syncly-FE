import Button from "../../shared/ui/Button";
import { useRef, useState, useEffect } from "react";

const FilePath = ({
  setShowInput,
}: {
  setShowInput: (boolean: boolean) => void;
}) => {
  const [filePlusModal, setFilePlusModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="w-full flex justify-between items-center mt-5">
      <div className="flex items-center gap-[50px]">
        <p className="font-medium text-[32px] overflow-hidden overflow-ellipsis">
          Files
        </p>
      </div>
      <div className="relative">
        <Button
          colorType="main"
          iconName="add_circle"
          onClick={() => setFilePlusModal(true)}
        />
        {filePlusModal && (
          <div
            className="absolute bottom-[-100px] right-0 flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
            ref={modalRef}
          >
            <p
              className="text-[#828282] cursor-pointer flex-nowrap"
              onClick={() => setShowInput(true)}
            >
              폴더 생성
            </p>
            <p className="text-[#828282] cursor-pointer flex-nowrap">
              파일 추가
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePath;
