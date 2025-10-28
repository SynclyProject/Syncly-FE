import Icon from "../../shared/ui/Icon";
import Button from "../../shared/ui/Button";
import { useShowImage } from "../../hooks/useShowImage";
import { GetMemberInfo } from "../../shared/api/Member/get_delete";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { createNote } from "../../shared/api/note";

interface INoteInputProps {
  onAdd?: (noteId: number, title: string) => void;
  onCancel?: () => void;
  onSave?: (title: string) => void; // 제목 수정 모드용
  setTitle: (title: string) => void;
  title: string;
  mode?: "create" | "edit"; // 모드 추가
}

const NoteInput = ({
  onAdd,
  onCancel,
  onSave,
  setTitle,
  title,
  mode = "create",
}: INoteInputProps) => {
  const { id: workspaceIdStr } = useParams<{ id: string }>();
  const workspaceId = Number(workspaceIdStr) || 0;
  const { data: memberInfo } = useQuery({
    queryKey: ["memberInfo"],
    queryFn: GetMemberInfo,
  });
  const creatorProfileUrl = useShowImage(
    memberInfo?.result.profileImageObjectKey
  );

  const handleSave = () => {
    if (mode === "edit" && onSave && title.trim()) {
      onSave(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    // 편집 모드: 제목 저장
    if (mode === "edit" && onSave && title.trim()) {
      e.preventDefault();
      onSave(title);
      return;
    }

    // 생성 모드: 새 노트 생성
    if (mode === "create" && onAdd && title.trim()) {
      e.preventDefault();
      (async () => {
        try {
          const created = await createNote(workspaceId, { title });
          onAdd(created.id, created.title);
          setTitle("");
        } catch (err) {
          console.error("노트 생성 실패", err);
        }
      })();
    }
  };

  return (
    <div className="flex flex-col w-full h-full" data-color-mode="light">
      {/* 헤더 */}
      <div className="h-[56px] flex items-center gap-5 bg-white rounded-t-[8px] p-3 border-l border-r border-t border-[#E0E0E0]">
        <div className="w-[24px] h-[24px] rounded-full">
          {creatorProfileUrl ? (
            <img
              src={creatorProfileUrl}
              alt="creator"
              className="w-[24px] h-[24px] rounded-full"
            />
          ) : (
            <Icon name="User_Default" />
          )}
        </div>
        <input
          placeholder="노트 제목을 입력하세요"
          className="text-[16px] font-semibold outline-none flex-1 placeholder:text-[#C0C0C0]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {/* 버튼 */}
        {mode === "edit" && (
          <Button
            colorType="sub"
            onClick={handleSave}
            disabled={!title.trim()}
            iconName="Check_round"
            title="저장"
          />
        )}
        <Button colorType="sub" iconName="Close_White" onClick={onCancel} />
      </div>

      {/* 프리뷰 (선택사항) */}
      <div className="flex-1 bg-white rounded-b-[8px] p-4 border-l border-r border-b border-[#E0E0E0] overflow-auto text-[#828282] text-center flex items-center justify-center">
        <p>
          {mode === "edit"
            ? "노트 제목을 수정합니다"
            : "새로운 노트를 생성합니다"}
        </p>
      </div>
    </div>
  );
};

export default NoteInput;
