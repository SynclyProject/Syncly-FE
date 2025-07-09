import Icon from "../../shared/ui/Icon";
import { useState, useRef, useEffect } from "react";
import { TFiles } from "../../shared/type/FilesType";
import FileInput from "./FileInput";

type TTypeProps = {
  type: "folder" | "image" | "file" | "video";
};
interface IFileProps extends TTypeProps {
  title: string;
  date: string;
  user?: string;
  fileId?: number;
  setFileList?: React.Dispatch<React.SetStateAction<TFiles[]>>;
}

const File = ({ type, title, date, user, fileId, setFileList }: IFileProps) => {
  const [modalShow, setModalShow] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const handleEditTitle = (text: string) => {
    if (!text.trim()) return;
    if (fileId && setFileList) {
      setFileList((prev) =>
        prev.map((file) =>
          file.id === fileId ? { ...file, title: text, date: today } : file
        )
      );
    }
    setEditTitle(false);
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

  return (
    <>
      {editTitle ? (
        <FileInput
          type={type}
          onAdd={handleEditTitle}
          onCancel={() => setEditTitle(false)}
          initialValue={title}
          user={"userProfile"}
        />
      ) : (
        <div className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0] hover:cursor-pointer">
          <Icon name={type} />
          <p className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold">
            {title}
          </p>
          <p className="text-[#828282]">{date}</p>
          {user && <Icon name={user} rounded={true} />}
          <div className="relative">
            <button
              className="cursor-pointer"
              onClick={() => setModalShow(true)}
            >
              <Icon name="more-horizontal" />
            </button>

            {modalShow && (
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
                <p className="text-[#828282] cursor-pointer flex-nowrap">
                  휴지통으로 이동
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default File;
