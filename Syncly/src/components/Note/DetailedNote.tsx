import Icon from "../../shared/ui/Icon";
import { useShowImage } from "../../hooks/useShowImage";
import Button from "../../shared/ui/Button";
import { useNoteStore } from "../../store/useNoteStore";
import { useEffect, useRef, useState } from "react";
import { getNoteWebSocketService } from "../../shared/api/webSocketService";
import { useAuthContext } from "../../context/AuthContext";
import { TEnterPayload, TEditPayload } from "../../shared/type/note";

interface IDetailedNoteProps {
  noteId: number;
  setShowInput: (show: boolean) => void;
}

const DetailedNote = ({ noteId, setShowInput }: IDetailedNoteProps) => {
  const { memberId } = useAuthContext();
  const {
    currentNote,
    content,
    syncStatus,
    error,
    setCurrentNote,
    applyLocalOperation,
    handleRemoteEdit,
    setError,
    setLoading,
  } = useNoteStore();

  const wsServiceRef = useRef(getNoteWebSocketService());
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "">(
    ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const textEditorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComposingRef = useRef<boolean>(false);
  const isResyncingRef = useRef<boolean>(false);
  const isLocalEditRef = useRef<boolean>(false);
  const pendingRemoteEditsRef = useRef<TEditPayload[]>([]);
  const lastContentRef = useRef<string>("");

  console.log("currentNote: ", currentNote);

  const creatorProfileUrl = useShowImage(
    currentNote?.creatorProfileImage || null
  );

  // 초기 content 설정
  useEffect(() => {
    if (textEditorRef.current && content) {
      textEditorRef.current.value = content;
      lastContentRef.current = content;
    }
  }, [noteId]);

  // 상대방 편집 반영
  useEffect(() => {
    if (
      textEditorRef.current &&
      !isComposingRef.current &&
      !isLocalEditRef.current
    ) {
      const currentDOM = textEditorRef.current.value;
      if (content !== currentDOM) {
        console.log("📝 상대방 편집 반영");

        const cursorPos = textEditorRef.current.selectionStart;

        isResyncingRef.current = true;
        try {
          textEditorRef.current.value = content;
          lastContentRef.current = content;

          const newCursorPos = Math.min(cursorPos, content.length);
          textEditorRef.current.setSelectionRange(newCursorPos, newCursorPos);
        } finally {
          isResyncingRef.current = false;
        }
      }
    }
  }, [content]);

  // 🔌 WebSocket 연결 및 노트 입장
  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        if (!memberId) {
          console.log("⏳ memberId 로드 대기 중...");
          return;
        }

        setLoading(true);
        const wsService = wsServiceRef.current;

        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
        }

        console.log("🔌 WebSocket 연결 중...");

        const handleWebSocketError = (error) => {
          console.error("❌ WebSocket 에러:", error);

          if (
            error?.payload?.code === "Note409_1" ||
            error?.payload?.code === "Note409_2"
          ) {
            console.log("🔄 OT 충돌 감지");

            if (
              error.payload.content !== undefined &&
              error.payload.revision !== undefined
            ) {
              isResyncingRef.current = true;

              try {
                useNoteStore.setState({
                  content: error.payload.content,
                  revision: error.payload.revision,
                  pendingOperations: [],
                  syncStatus: "synced",
                });

                if (textEditorRef.current) {
                  textEditorRef.current.value = error.payload.content;
                  lastContentRef.current = error.payload.content;
                }

                setError(
                  "편집 충돌이 발생했습니다. 최신 버전으로 복구되었습니다."
                );
              } finally {
                isResyncingRef.current = false;
              }
            }
          } else {
            setError("실시간 연결 오류");
          }
        };

        await wsService.connect(token, handleWebSocketError);

        console.log("✅ WebSocket 연결 성공");

        const handleEnter = (payload: TEnterPayload) => {
          setCurrentNote(
            {
              id: payload.noteId,
              title: payload.title,
              content: payload.content,
              workspaceId: 0,
              creatorId: 0,
              creatorName: "Unknown",
              lastModifiedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              participantCount: payload.activeUsers.length,
              activeParticipants: [],
            },
            0
          );

          useNoteStore.setState({
            revision: payload.revision,
          });

          if (textEditorRef.current) {
            textEditorRef.current.value = payload.content;
            lastContentRef.current = payload.content;
          }
        };

        const handleEdit = (payload: TEditPayload) => {
          const currentState = useNoteStore.getState();

          if (isLocalEditRef.current || isComposingRef.current) {
            console.log("📋 로컬 편집 중 - remote edit 큐에 저장");
            pendingRemoteEditsRef.current.push(payload);
            return;
          }

          if (payload.operation.workspaceMemberId === memberId) {
            const receivedRevision = payload.operation.revision;
            const newPending = currentState.pendingOperations.filter(
              (op) => op.revision > receivedRevision
            );

            console.log("🔄 자신의 편집 확인됨:", {
              receivedRevision,
              removed:
                currentState.pendingOperations.length - newPending.length,
            });

            useNoteStore.setState({
              pendingOperations: newPending,
              revision: receivedRevision + 1,
              syncStatus: newPending.length === 0 ? "synced" : "pending",
            });
            return;
          }

          handleRemoteEdit(payload.operation);
        };

        const handleSave = () => {
          console.log("💾 저장 완료");
          setAutoSaveStatus("saved");
          setTimeout(() => setAutoSaveStatus(""), 3000);
        };

        await wsService.subscribeToNoteEnter(noteId, handleEnter);
        wsService.subscribeToEdits(noteId, handleEdit);
        wsService.subscribeToSave(noteId, handleSave);

        setLoading(false);
      } catch (err) {
        console.error("❌ WebSocket 연결 실패:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "실시간 편집 연결에 실패했습니다.";
        setError(errorMsg);
        setLoading(false);
      }
    };

    connectAndSubscribe();

    return () => {
      wsServiceRef.current.unsubscribeFromNote(noteId, () => {
        console.log("🔌 노트 퇴장 완료");
      });
    };
  }, [
    noteId,
    memberId,
    setCurrentNote,
    handleRemoteEdit,
    setError,
    setLoading,
  ]);

  // 자동 저장
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (syncStatus === "pending") {
      setAutoSaveStatus("saving");

      autoSaveTimerRef.current = setTimeout(() => {
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus(""), 3000);
      }, 2000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [syncStatus]);

  // IME 조합 시작
  const handleCompositionStart = () => {
    isComposingRef.current = true;
    console.log("🌐 compositionStart");
  };

  // IME 조합 완료
  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    console.log("🌐 compositionEnd");

    // 다음 tick에서 처리된 텍스트 변화를 감지하도록
    Promise.resolve().then(() => {
      if (textEditorRef.current) {
        const newContent = textEditorRef.current.value;
        if (newContent !== lastContentRef.current) {
          // onChange가 트리거되지 않았으면 수동으로 처리
          handleTextChange({
            currentTarget: textEditorRef.current,
          } as any);
        }
      }
    });
  };

  // 텍스트 변경 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) {
      console.log("⏭️ IME 조합 중 - 무시");
      return;
    }

    if (isResyncingRef.current) {
      console.log("⏭️ OT 복구 중 - 무시");
      return;
    }

    if (!memberId) {
      console.warn("⚠️ memberId 없음");
      return;
    }

    const newContent = e.currentTarget.value;
    const oldContent = lastContentRef.current;

    if (newContent === oldContent) {
      return;
    }

    console.log("📝 텍스트 변경:", {
      old: oldContent.substring(0, 30),
      new: newContent.substring(0, 30),
    });

    const diff = calculateDiff(oldContent, newContent);
    if (!diff) {
      console.log("ℹ️ diff 없음");
      return;
    }

    console.log("🎯 Diff:", diff);
    lastContentRef.current = newContent;

    const currentState = useNoteStore.getState();
    const operationRevision = currentState.revision;

    const operation = {
      type: diff.type as "insert" | "delete",
      position: diff.position,
      length: diff.length,
      content: diff.content,
      workspaceMemberId: memberId,
      revision: operationRevision,
      timestamp: new Date().toISOString(),
    };

    isLocalEditRef.current = true;

    try {
      console.log("📤 operation 생성:", operation);
      applyLocalOperation(operation);

      try {
        wsServiceRef.current.sendEdit(noteId, operation);
      } catch (err) {
        console.error("❌ 전송 실패:", err);
        setError("편집 전송 실패");
      }
    } finally {
      Promise.resolve().then(() => {
        isLocalEditRef.current = false;

        if (pendingRemoteEditsRef.current.length > 0) {
          console.log(
            `📤 ${pendingRemoteEditsRef.current.length}개 remote edit 처리`
          );
          const queuedEdits = pendingRemoteEditsRef.current;
          pendingRemoteEditsRef.current = [];

          queuedEdits.forEach((payload) => {
            if (payload.operation.workspaceMemberId !== memberId) {
              handleRemoteEdit(payload.operation);
            }
          });
        }
      });
    }
  };

  // Diff 계산
  const calculateDiff = (
    oldText: string,
    newText: string
  ): {
    type: "insert" | "delete";
    position: number;
    length: number;
    content?: string;
  } | null => {
    if (oldText === newText) return null;

    let startIdx = 0;
    while (
      startIdx < oldText.length &&
      startIdx < newText.length &&
      oldText[startIdx] === newText[startIdx]
    ) {
      startIdx++;
    }

    let oldEndIdx = oldText.length - 1;
    let newEndIdx = newText.length - 1;
    while (
      oldEndIdx >= startIdx &&
      newEndIdx >= startIdx &&
      oldText[oldEndIdx] === newText[newEndIdx]
    ) {
      oldEndIdx--;
      newEndIdx--;
    }

    const oldChanged = oldText.substring(startIdx, oldEndIdx + 1);
    const newChanged = newText.substring(startIdx, newEndIdx + 1);

    console.log("📊 Diff 분석:", {
      startIdx,
      oldEndIdx,
      newEndIdx,
      oldChanged: JSON.stringify(oldChanged),
      newChanged: JSON.stringify(newChanged),
    });

    if (newChanged.length > oldChanged.length) {
      const insertLength = newChanged.length - oldChanged.length;
      const insertContent = newChanged.substring(oldChanged.length);
      const insertPosition = startIdx + oldChanged.length;

      return {
        type: "insert",
        position: insertPosition,
        length: insertLength,
        content: insertContent,
      };
    } else if (newChanged.length < oldChanged.length) {
      const deleteLength = oldChanged.length - newChanged.length;
      const deletePosition = startIdx + newChanged.length;

      return {
        type: "delete",
        position: deletePosition,
        length: deleteLength,
      };
    } else if (oldChanged !== newChanged) {
      const deletePosition = startIdx;

      return {
        type: "delete",
        position: deletePosition,
        length: oldChanged.length,
      };
    }

    return null;
  };

  // 수동 저장
  const handleManualSave = () => {
    try {
      setIsSaving(true);
      setAutoSaveStatus("saving");

      const wsService = wsServiceRef.current;
      wsService.saveNote(noteId);
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      setError("저장 실패");
      setAutoSaveStatus("");
      setIsSaving(false);
    }
  };

  if (!currentNote) {
    return (
      <div className="bg-white rounded-[8px] px-5 h-full flex items-center justify-center text-[#828282]">
        노트를 로드 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* 헤더 */}
      <div className="h-[56px] flex items-center gap-5 bg-white rounded-t-[8px] p-3 border border-[#E0E0E0]">
        {creatorProfileUrl ? (
          <img
            src={creatorProfileUrl}
            alt="creator"
            className="w-[24px] h-[24px] rounded-full"
          />
        ) : (
          <div className="w-[24px] h-[24px] rounded-full">
            <Icon name="User_Default" />
          </div>
        )}
        {/* <p className="text-[14px] text-[#828282]">{currentNote.creatorName}</p> */}
        <p className="text-[16px] font-semibold flex-1 overflow-hidden text-ellipsis ">
          {currentNote.title}
        </p>

        {/* 상태 표시 */}
        <div className="flex items-center gap-2">
          {autoSaveStatus === "saving" && (
            <span className="text-[12px] text-[#FF9500]">저장 중...</span>
          )}
          {autoSaveStatus === "saved" && (
            <span className="text-[12px] text-[#4CAF50]">저장됨</span>
          )}
          {syncStatus === "conflict" && (
            <span className="text-[12px] text-[#F45B69]">충돌 발생</span>
          )}
          {error && (
            <span className="text-[12px] text-[#F45B69]" title={error}>
              ⚠️ 오류
            </span>
          )}
        </div>

        <p className="text-[16px] text-[#828282] pr-[20px]">
          {currentNote.createdAt &&
            new Date(currentNote.createdAt).toLocaleDateString("ko-KR")}
        </p>
        <Button
          colorType="sub"
          onClick={handleManualSave}
          disabled={isSaving}
          title="노트를 수동으로 저장합니다"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          colorType="sub"
          iconName="Pen"
          onClick={() => setShowInput(true)}
        />
      </div>

      {/* 에디터 */}
      <textarea
        ref={textEditorRef}
        onChange={handleTextChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="h-full bg-white rounded-b-[8px] px-4 py-3 border-l border-r border-b border-[#E0E0E0] overflow-auto resize-none font-mono"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      />
    </div>
  );
};

export default DetailedNote;
