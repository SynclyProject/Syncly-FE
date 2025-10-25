import Icon from "../../shared/ui/Icon";
import { useState, useRef, useEffect } from "react";
import { useShowImage } from "../../hooks/useShowImage";
import { deleteNote, handleNoteApiError } from "../../shared/api/note";
import { useParams } from "react-router-dom";

interface INoteProps {
  title: string;
  date: string;
  noteId: number;
  creatorName: string;
  creatorProfileImage?: string;
  setSelectedId: (id: number) => void;
  setShowInput: (show: boolean) => void;
  onDelete?: (noteId: number) => void;
}

const Note = ({
  title,
  date,
  noteId,
  creatorName,
  creatorProfileImage,
  setSelectedId,
  setShowInput,
  onDelete,
}: INoteProps) => {
  const { id: workspaceIdStr } = useParams<{ id: string }>();
  const workspaceId = Number(workspaceIdStr) || 0;

  const [modalShow, setModalShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleNoteClick = () => {
    setSelectedId(noteId);
    setShowInput(false);
  };

  const profileImageUrl = useShowImage(creatorProfileImage || null);

  // 🗑️ 노트 삭제 (HTTP API)
  const handleDelete = async () => {
    if (!confirm("이 노트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);

      // HTTP API로 노트 삭제 요청
      await deleteNote(workspaceId, noteId);
      console.log("✅ 노트 삭제 완료");
      setModalShow(false);
      onDelete?.(noteId);
    } catch (err) {
      console.error("❌ 노트 삭제 실패:", err);
      alert("노트 삭제에 실패했습니다: " + handleNoteApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  // 외부 클릭 감지
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
    <div className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0] hover:cursor-pointer hover:bg-[#F9F9F9]">
      <p
        className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold"
        onClick={handleNoteClick}
      >
        {title}
      </p>
      <p className="text-[#828282] text-[14px]">{date}</p>
      {!profileImageUrl ? (
        <div className="w-[24px] h-[24px] rounded-full">
          <Icon name="User_Default" />
        </div>
      ) : (
        <img
          src={profileImageUrl}
          alt={creatorName}
          className="w-[24px] h-[24px] rounded-full"
          title={creatorName}
        />
      )}
      <div className="relative">
        <button
          className="cursor-pointer p-1"
          onClick={() => setModalShow(!modalShow)}
          ref={buttonRef}
          disabled={isDeleting}
        >
          <Icon name="more-horizontal" />
        </button>

        {modalShow && (
          <div
            className="z-10 w-[160px] absolute top-6 right-0 flex flex-col gap-2 rounded-[8px] bg-white p-4 border border-[#E0E0E0] shadow-lg"
            ref={modalRef}
          >
            <p
              className="text-[#828282] cursor-pointer flex-nowrap hover:text-[#F45B69] hover:font-bold"
              onClick={handleDelete}
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
