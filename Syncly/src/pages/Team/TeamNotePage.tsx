import NoteSearch from "../../components/Note/NoteSearch";
import NoteList from "../../components/Note/NoteList";
import TeamNavigate from "../../components/TeamNavigate";
import TeamFileSkeleton from "../../shared/ui/Skeleton/TeamFileSkeleton";
import { useEffect, useState, useRef } from "react";
import useDebounce from "../../hooks/useDebounce";
import NoteInput from "../../components/Note/NoteInput";
import DetailedNote from "../../components/Note/DetailedNote";
import { getNoteWebSocketService } from "../../shared/api/webSocketService";
import { useAuthContext } from "../../context/AuthContext";

const TeamNotePage = () => {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [sort, setSort] = useState(false);
  const [mq, setMq] = useState("");
  const useDebouncedValue = useDebounce(mq, 500);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [noteListKey, setNoteListKey] = useState(0); // 목록 새로고침용 key
  const [wsReady, setWsReady] = useState(false); // WebSocket 준비 완료 여부
  const { isLogin } = useAuthContext();
  const wsConnectionAttempted = useRef(false);

  // 🔌 WebSocket 연결 초기화 (페이지 로드 시)
  useEffect(() => {
    if (!isLogin || wsConnectionAttempted.current) {
      return;
    }

    const initializeWebSocket = async () => {
      try {
        wsConnectionAttempted.current = true;
        const wsService = getNoteWebSocketService();

        // 이미 연결되어 있으면 스킵
        if (wsService.getIsConnected()) {
          console.log("✅ WebSocket이 이미 연결되어 있습니다");
          return;
        }

        // localStorage에서 token 가져오기
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("⚠️ 액세스 토큰이 없습니다");
          wsConnectionAttempted.current = false;
          return;
        }

        console.log("🔌 WebSocket 연결 시작...");
        await wsService.connect(token, (error) => {
          console.error("❌ WebSocket 에러:", error);
        });
        console.log("✅ WebSocket 연결 완료");
        setWsReady(true); // WebSocket 준비 완료 표시
      } catch (err) {
        console.error("❌ WebSocket 연결 실패:", err);
        wsConnectionAttempted.current = false; // 재시도 가능하게 설정
        setWsReady(false);
      }
    };

    initializeWebSocket();

    // cleanup 함수는 연결을 해제하지 않음 (다른 페이지에서도 사용할 수 있으므로)
    return () => {
      // 페이지를 떠날 때 자동으로 WebSocket을 끊지 않음
    };
  }, [isLogin]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 📝 노트 생성 완료 핸들러
  const handleNoteAdd = (noteId: number, title: string) => {
    console.log("✅ 새 노트 생성됨:", noteId, title);
    setSelectedId(noteId);
    setShowInput(false);
    // NoteList를 리마운트하여 최신 목록을 로드
    setNoteListKey((prev) => prev + 1);
  };

  // ❌ 취소 핸들러
  const handleCancel = () => {
    setShowInput(false);
  };

  if (isLoading) {
    return <TeamFileSkeleton />;
  }

  return (
    <div className="w-full mx-[74px] flex flex-col items-center gap-5">
      <div className="w-full flex mt-5">
        <TeamNavigate state="note" />
      </div>
      <div className="w-full flex flex-col gap-5">
        <NoteSearch
          setSearchValue={setMq}
          setSort={setSort}
          setShowInput={setShowInput}
          showInput={showInput}
          onAdd={handleNoteAdd}
          setTitle={setTitle}
          title={title}
        />
        <div className="flex gap-5 w-full">
          {/* 노트 목록 */}
          <div className="flex-1 h-[calc(70vh-56px)]">
            <NoteList
              key={noteListKey}
              searchValue={useDebouncedValue}
              sort={sort}
              setSelectedId={setSelectedId}
              setShowInput={setShowInput}
              wsReady={wsReady}
            />
          </div>

          {/* 상세보기 / 생성 / 빈 화면 */}
          <div className="flex-1 h-[calc(70vh-56px)]">
            {showInput ? (
              <NoteInput
                onAdd={handleNoteAdd}
                onCancel={handleCancel}
                setTitle={setTitle}
                title={title}
              />
            ) : selectedId ? (
              <DetailedNote
                noteId={selectedId}
                setShowInput={setShowInput}
                setTitle={setTitle}
              />
            ) : (
              <div className="bg-white rounded-[8px] px-5 h-full flex items-center justify-center text-[#828282]">
                노트를 선택하거나 새로 생성하세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamNotePage;
