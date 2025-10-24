import { useState } from "react";
import Icon from "../../shared/ui/Icon";
import Button from "../../shared/ui/Button";
import { useParams } from "react-router-dom";
import { createNote, handleNoteApiError } from "../../shared/api/note";

interface INoteInputProps {
  onAdd?: (noteId: number, title: string) => void;
  onCancel?: () => void;
}

const NoteInput = ({ onAdd, onCancel }: INoteInputProps) => {
  const { id: workspaceIdStr } = useParams<{ id: string }>();
  const workspaceId = Number(workspaceIdStr) || 0;

  const [title, setTitle] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📝 노트 생성 (HTTP API)
  const handleCreate = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!workspaceId) {
      setError("워크스페이스를 선택해주세요.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // HTTP API로 노트 생성 요청
      const response = await createNote(workspaceId, { title });
      console.log("✅ 노트 생성 완료:", response);

      // 콜백 실행 (부모에서 목록 새로고침)
      onAdd?.(response.id, response.title);

      // 입력 초기화
      setTitle("");
    } catch (err) {
      console.error("❌ 노트 생성 실패:", err);
      setError(handleNoteApiError(err));
    } finally {
      setIsCreating(false);
    }
  };

  // Enter 키로 생성
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="flex flex-col w-full h-full" data-color-mode="light">
      {/* 헤더 */}
      <div className="h-[56px] flex items-center gap-5 bg-white rounded-t-[8px] p-3 border-l border-r border-t border-[#E0E0E0]">
        <div className="w-[24px] h-[24px] rounded-full">
          <Icon name="User_Default" />
        </div>
        <input
          placeholder="노트 제목을 입력하세요"
          className="text-[16px] font-semibold outline-none flex-1 placeholder:text-[#C0C0C0]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          disabled={isCreating}
        />

        {/* 에러 표시 */}
        {error && (
          <span className="text-[12px] text-[#F45B69]">{error}</span>
        )}

        {/* 버튼 */}
        <div className="flex gap-2">
          <Button
            colorType="sub"
            iconName="X"
            onClick={onCancel}
            disabled={isCreating}
          />
          <Button
            colorType="main"
            onClick={handleCreate}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? "생성 중..." : "생성"}
          </Button>
        </div>
      </div>

      {/* 프리뷰 (선택사항) */}
      <div className="flex-1 bg-white rounded-b-[8px] p-4 border-l border-r border-b border-[#E0E0E0] overflow-auto text-[#828282] text-center flex items-center justify-center">
        <p>새로운 노트를 생성합니다</p>
      </div>
    </div>
  );
};

export default NoteInput;
