import { useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import { createNote, handleNoteApiError } from "../../shared/api/note";

const NoteSearch = ({
  setSearchValue,
  setSort,
  setShowInput,
  showInput,
  onAdd,
  setTitle,
  title,
}: {
  setSearchValue: (value: string) => void;
  setSort: (value: boolean) => void;
  setShowInput: (value: boolean) => void;
  showInput: boolean;
  onAdd?: (noteId: number, title: string) => void;
  setTitle: (title: string) => void;
  title: string;
}) => {
  const { id: workspaceIdStr } = useParams<{ id: string }>();
  const workspaceId = Number(workspaceIdStr) || 0;

  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("mq") ?? "");
  const [showFilter, setShowFilter] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        showFilter &&
        !modalRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);

  useEffect(() => {
    setSearchParams({ mq: inputValue });
    setSearchValue(inputValue);
  }, [inputValue, setSearchParams, setSearchValue]);

  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setTitle(e.target.value);
  };

  // 📝 노트 생성 (HTTP API)
  const handleCreateNote = async () => {
    console.log("🚀 handleCreateNote 시작:", { title, workspaceId });

    if (!title.trim()) {
      console.log("❌ 제목이 비어있음");
      setError("제목을 입력해주세요.");
      return;
    }

    if (!workspaceId) {
      console.log("❌ workspaceId가 없음");
      setError("워크스페이스를 선택해주세요.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // HTTP API로 노트 생성 요청
      const response = await createNote(workspaceId, { title });
      console.log("✅ 노트 생성 완료:", response);

      // NoteList에서 이미 WebSocket 구독을 처리하므로 여기서는 추가 구독하지 않음
      console.log(
        "📝 노트 생성 완료 - NoteList에서 WebSocket을 통해 자동 업데이트됨"
      );

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
  return (
    <div className="flex flex-col gap-5 mt-5">
      <p
        className="font-medium text-[32px] overflow-hidden overflow-ellipsis cursor-pointer"
        onClick={() => setShowInput(false)}
      >
        Note
      </p>
      <div className="flex items-center gap-[10px] w-full">
        <div className="flex items-center gap-[10px] px-3 py-2 border border-[#E0E0E0] rounded-[8px] bg-white">
          <Icon name="search" />
          <input
            className="w-full outline-none"
            type="text"
            placeholder="Search notes..."
            value={inputValue}
            onChange={onChangeSearchValue}
          />
        </div>
        <div className="relative flex-1">
          <Button
            colorType="white"
            iconName="filter"
            onClick={() => setShowFilter(true)}
          >
            Filter
          </Button>
          {showFilter && (
            <div
              className="absolute bottom-[-105px] left-0 flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
              ref={modalRef}
            >
              <p
                className="text-[#828282] cursor-pointer"
                onClick={() => setSort(false)}
              >
                최신순
              </p>
              <p
                className="text-[#828282] cursor-pointer"
                onClick={() => setSort(true)}
              >
                가나다순
              </p>
            </div>
          )}
        </div>
        {error && <span className="text-[12px] text-[#F45B69]">{error}</span>}
        {!showInput ? (
          <Button
            colorType="main"
            iconName="add_circle"
            onClick={() => setShowInput(true)}
          />
        ) : (
          <Button
            colorType="main"
            iconName="Check_round"
            onClick={() => {
              handleCreateNote();
              setShowInput(false);
            }}
            disabled={!title.trim() || isCreating}
          />
        )}
      </div>
    </div>
  );
};

export default NoteSearch;
