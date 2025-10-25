import Note from "./Note";
import { TNotes } from "../../shared/type/note";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNoteList } from "../../shared/api/note";
import { getNoteWebSocketService } from "../../shared/api/webSocketService";

interface INoteListProps {
  searchValue: string;
  sort: boolean;
  setSelectedId: (id: number) => void;
  setShowInput: (show: boolean) => void;
  wsReady?: boolean; // WebSocket 준비 완료 여부
}

const NoteList = ({
  searchValue,
  sort,
  setSelectedId,
  setShowInput,
  wsReady = false,
}: INoteListProps) => {
  const { id: workspaceIdStr } = useParams<{ id: string }>();
  const workspaceId = Number(workspaceIdStr) || 0;

  const [notes, setNotes] = useState<TNotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 📋 노트 목록 조회 (HTTP API 사용 - WebSocket은 상세 편집에서만 사용)
  useEffect(() => {
    if (!workspaceId) {
      console.warn("⚠️ workspaceId가 없습니다:", workspaceId);
      setIsLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(
          `📡 노트 목록 조회 시작: workspaceId=${workspaceId}, page=${currentPage}`
        );

        // HTTP API로 노트 목록 조회 (WebSocket 연결 대기 불필요)
        const response = await getNoteList(
          workspaceId,
          currentPage,
          20,
          "lastModifiedAt",
          "desc"
        );

        console.log("✅ 노트 목록 조회 성공:", response);

        // 응답 검증
        if (!response) {
          throw new Error("응답이 비어있습니다");
        }

        if (!Array.isArray(response.notes)) {
          console.error("❌ response.notes가 배열이 아닙니다:", response);
          throw new Error(
            `response.notes는 배열이어야 하는데 ${typeof response.notes}입니다`
          );
        }

        setNotes(response.notes);
        setTotalPages(response.totalPages || 0);

        console.log(
          `✨ 노트 ${response.notes.length}개 로드됨, 총 ${
            response.totalPages || 0
          }페이지`
        );
      } catch (err) {
        console.error("❌ 노트 목록 조회 실패:", err);
        const errorMsg =
          (err as Error).message || "노트 목록을 조회할 수 없습니다";
        setError(errorMsg);
        console.error("📌 에러 메시지:", errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [workspaceId, currentPage]);

  // 🔄 실시간 노트 목록 업데이트 구독 (WebSocket)
  useEffect(() => {
    const wsService = getNoteWebSocketService();

    if (!workspaceId || !wsReady || !wsService.getIsConnected()) {
      console.log("⚠️ WebSocket이 준비되지 않았거나 workspaceId가 없습니다", {
        workspaceId,
        wsReady,
        connected: wsService.getIsConnected(),
      });
      return;
    }

    try {
      console.log(`📡 노트 목록 구독 시작: workspaceId=${workspaceId}`);

      // 노트 생성/삭제 실시간 업데이트 구독
      wsService.subscribeToNoteListUpdates(workspaceId, (message: any) => {
        console.log("📨 노트 목록 업데이트 메시지:", message);

        if (message.type === "NOTE_CREATED") {
          // 새로운 노트가 생성됨
          const payload = message.payload;
          const newNote: TNotes = {
            id: payload.noteId,
            title: payload.title,
            content: "", // 초기값
            workspaceId: payload.workspaceId,
            creatorId: 0, // 브로드캐스트에서는 받을 수 없음
            creatorName: payload.creatorName,
            creatorProfileImage: payload.creatorProfileImage,
            lastModifiedAt: payload.createdAt,
            createdAt: payload.createdAt,
            participantCount: 1, // 생성자 본인만 포함
          };

          console.log("✨ 새 노트 추가:", newNote);
          setNotes((prevNotes) => [newNote, ...prevNotes]);
        } else if (message.type === "NOTE_DELETED") {
          // 노트가 삭제됨
          const deletedNoteId = message.payload.noteId;
          console.log("🗑️ 노트 삭제됨:", deletedNoteId);
          setNotes((prevNotes) =>
            prevNotes.filter((note) => note.id !== deletedNoteId)
          );
        }
      });

      return () => {
        // cleanup: 구독 해제
        wsService.unsubscribeFromNoteListUpdates(workspaceId);
      };
    } catch (err) {
      console.warn("⚠️ 노트 목록 구독 실패:", err);
      // WebSocket이 준비되지 않았다면 에러가 발생할 수 있음 (정상)
    }
  }, [workspaceId, wsReady]);

  // 🔍 검색 필터링
  const filteredNotes = notes.filter((note: TNotes) =>
    note.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const notesToShow = searchValue ? filteredNotes : notes;

  // 📊 정렬
  const sortedNotes = sort
    ? [...notesToShow].sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      )
    : notesToShow;

  const noDataMessage = searchValue
    ? "검색된 노트가 없습니다."
    : "저장한 노트가 없습니다.";

  return (
    <div
      className="flex flex-col w-full h-full bg-white rounded-[8px] px-5"
      style={{ maxHeight: "calc(70vh - 56px)" }}
    >
      {/* 헤더 */}
      <div className="w-full h-[56px] bg-white flex items-center gap-[63px]">
        <p className="flex-1 text-[16px] font-semibold pl-[20px]">Title</p>
        <p className="text-[16px] font-semibold">Date</p>
        <p className="text-[16px] font-semibold pr-[80px]">User</p>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="w-full h-[56px] bg-gray-100 flex items-center gap-[63px] border-t border-t-[#E0E0E0] animate-pulse">
          <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          <div className="w-20 h-4 bg-gray-300 rounded"></div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <p className="h-[56px] flex items-center justify-center text-[16px] font-semibold text-[#F45B69] border-t border-t-[#E0E0E0]">
          오류: {error}
        </p>
      )}

      {/* 리스트 */}
      {!isLoading && !error && (
        <div className="overflow-y-auto h-full max-h-[calc(70vh-56px)]">
          {sortedNotes.length > 0 ? (
            <>
              {sortedNotes.map((note: TNotes) => (
                <Note
                  key={note.id}
                  title={note.title}
                  date={new Date(note.lastModifiedAt).toLocaleDateString(
                    "ko-KR"
                  )}
                  noteId={note.id}
                  creatorName={note.creatorName}
                  creatorProfileImage={note.creatorProfileImage}
                  setSelectedId={setSelectedId}
                  setShowInput={setShowInput}
                />
              ))}
            </>
          ) : (
            <p className="h-[56px] flex items-center justify-center text-[16px] font-semibold text-[#828282] border-t border-t-[#E0E0E0]">
              {noDataMessage}
            </p>
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="h-[40px] flex items-center justify-center gap-2 border-t border-t-[#E0E0E0]">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-[12px] disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-[12px] text-[#828282]">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 text-[12px] disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteList;
