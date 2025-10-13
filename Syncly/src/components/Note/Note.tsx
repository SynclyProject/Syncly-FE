import Icon from "../../shared/ui/Icon";
import { useState, useRef, useEffect } from "react";
import { TUser } from "../../shared/type/FilesType";
import { useParams } from "react-router-dom";
import { useShowImage } from "../../hooks/useShowImage";

interface INoteProps {
  title: string;
  date: string;
  user?: TUser;
  noteId: number;
  setSelectedId: (id: number) => void;
}

const Note = ({ title, date, user, noteId, setSelectedId }: INoteProps) => {
  const [modalShow, setModalShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { id } = useParams();
  const workspaceId = Number(id);

  const handleNoteClick = () => {
    setSelectedId(noteId);
  };
  const profileImageUrl = useShowImage(user?.profileUrl || null);

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
    <div className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0] hover:cursor-pointer">
      <p
        className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold"
        onClick={handleNoteClick}
      >
        {title}
      </p>
      <p className="text-[#828282]">{date}</p>
      {!profileImageUrl ? (
        <div className="w-[24px] h-[24px] rounded-full">
          <Icon name="User_Default" />
        </div>
      ) : (
        <img
          src={profileImageUrl ?? undefined}
          alt="profile"
          className="w-[24px] h-[24px] rounded-full"
        />
      )}
      <div className="relative">
        <button className="cursor-pointer" onClick={() => setModalShow(true)}>
          <Icon name="more-horizontal" />
        </button>

        {modalShow && (
          <div
            className="z-10 w-[160px] absolute top-0 right-[30px] flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
            ref={modalRef}
          >
            <p
              className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#F45B69] hover:font-bold"
              onClick={() => {}}
            >
              삭제하기
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
