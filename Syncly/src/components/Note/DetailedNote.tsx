import Icon from "../../shared/ui/Icon";
import { useShowImage } from "../../hooks/useShowImage";
import Button from "../../shared/ui/Button";
import { useNoteStore } from "../../store/useNoteStore";
import { useEffect, useRef, useState } from "react";
import { getNoteWebSocketService } from "../../shared/api/webSocketService";
import { useAuthContext } from "../../context/AuthContext";
import { TEnterPayload } from "../../shared/type/note";
import { useParams } from "react-router-dom";
import { getNoteDetail, patchNoteTitle } from "../../shared/api/note";
import Markdown from "react-markdown";
import * as Y from "yjs";

interface IDetailedNoteProps {
  noteId: number;
  setTitle?: (title: string) => void;
  title?: string;
  onTitleUpdated?: () => void; // 목록 새로고침용 콜백
}

const DetailedNote = ({
  noteId,
  setTitle,
  title = "",
  onTitleUpdated,
}: IDetailedNoteProps) => {
  const { memberId } = useAuthContext();
  const { id: workspaceIdStr } = useParams<{ id: string }>();
  const workspaceId = Number(workspaceIdStr) || 0;
  const {
    currentNote,
    content,
    syncStatus,
    error,
    cursors,
    setCurrentNote,
    initializeYjs,
    getYText,
    getYDoc,
    setError,
    setLoading,
    setLocalCursorPosition,
  } = useNoteStore();

  const wsServiceRef = useRef(getNoteWebSocketService());
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "">(
    ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isMarkDownMode, setIsMarkDownMode] = useState(false);
  const [isEnterComplete, setIsEnterComplete] = useState(false);
  const [currentUserWorkspaceMemberId, setCurrentUserWorkspaceMemberId] =
    useState<number | null>(null);
  const textEditorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isComposingRef = useRef<boolean>(false);
  const lastContentRef = useRef<string>("");

  const creatorProfileUrl = useShowImage(
    currentNote?.creatorProfileImage || null
  );

  // Yjs content 변경 감시 (자동 동기화)
  // ⚠️ 중요: lastContentRef 비교를 통해 무한 루프 방지
  useEffect(() => {
    if (!textEditorRef.current || isComposingRef.current) return;

    // lastContentRef는 사용자 입력 후 업데이트되므로
    // 여기서 lastContentRef와 content가 다르면 원격 변경임을 의미
    if (content !== lastContentRef.current) {
      console.log("📝 Yjs 편집 반영 (원격 변경)");

      const cursorPos = textEditorRef.current.selectionStart;
      textEditorRef.current.value = content;
      lastContentRef.current = content;

      const newCursorPos = Math.min(cursorPos, content.length);
      textEditorRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  }, [content]);

  // Preview 모드에서 Text 모드로 전환 시 textarea 업데이트
  useEffect(() => {
    if (!isMarkDownMode && textEditorRef.current && content) {
      textEditorRef.current.value = content;
      lastContentRef.current = content;
    }
  }, [isMarkDownMode, content]);

  // 🔌 WebSocket 연결 및 Yjs 초기화
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

        const handleWebSocketError = (error: unknown) => {
          console.error("❌ WebSocket 에러:", error);
          setError("실시간 연결 오류");
        };

        await wsService.connect(token, handleWebSocketError);

        console.log("✅ WebSocket 연결 성공");

        const handleEnter = async (payload: TEnterPayload) => {
          try {
            console.log("📋 노트 입장 ENTER 메시지 수신:", { noteId, payload });

            // ENTER payload에서 activeUsers 정보로 activeParticipants 구성
            const activeParticipants = payload.activeUsers.map((user) => ({
              memberId: user.workspaceMemberId,
              memberName: user.userName,
              profileImage: user.profileImage,
              isOnline: true,
              joinedAt: new Date().toISOString(),
              color: user.color,
            }));

            // 현재 입장한 사용자의 WorkspaceMemberId는 payload에서 직접 가져옴
            const workspaceMemberId = payload.currentUserWorkspaceMemberId;
            setCurrentUserWorkspaceMemberId(workspaceMemberId);

            console.log("👤 현재 사용자:", {
              memberId,
              workspaceMemberId,
            });

            // ⚠️ 중요: ENTER 메시지에서 ydocBinary를 먼저 확인
            // Redis에 저장된 최신 상태가 있으면 그것을 사용하고,
            // 없으면 API에서 받은 content로 fallback
            console.log("📊 ENTER 메시지 분석:", {
              hasYdocBinary: !!payload.ydocBinary,
              ydocBinaryLength: payload.ydocBinary?.length || 0,
            });

            // Yjs 초기화 (payload.ydocBinary를 우선적으로 사용)
            initializeYjs(
              noteId,
              payload.ydocBinary || null,
              workspaceMemberId
            );

            // HTTP API로 노트 메타데이터 조회 (title, creator 정보 등)
            // ⚠️ 주의: noteData.content는 실제로 ydocBinary(Base64)가 전달됨
            try {
              const noteData = await getNoteDetail(workspaceId, noteId);
              console.log("✅ 노트 메타데이터 조회 성공:", {
                id: noteData.id,
                title: noteData.title,
                // ✅ API의 content는 ydocBinary(Base64) → 저장 완료 여부만 확인
                contentLength: noteData.content?.length || 0,
                contentPreview:
                  noteData.content?.substring(0, 50) || "(빈 노트)",
              });

              // 🔍 ydocBinary가 없는 경우 API content로 fallback
              let contentToUse = useNoteStore.getState().content;
              if (!payload.ydocBinary && noteData.content) {
                console.log(
                  "⚠️ ydocBinary 없음 - API content로 fallback:",
                  noteData.content.substring(0, 50)
                );
                // API content로 Yjs를 초기화
                const yText = useNoteStore.getState().getYText();
                const yDoc = useNoteStore.getState().getYDoc();
                if (yDoc && yText) {
                  yDoc.transact(() => {
                    yText.insert(0, noteData.content || "");
                  }, "init");
                  contentToUse = noteData.content;
                  console.log("✅ Yjs에 API content 입력 완료");
                }
              }

              setCurrentNote(
                {
                  id: noteData.id,
                  title: noteData.title,
                  content: contentToUse, // ydocBinary 또는 API content 사용
                  workspaceId: noteData.workspaceId,
                  creatorId: noteData.creatorId,
                  creatorName: noteData.creatorName,
                  creatorProfileImage: noteData.creatorProfileImage,
                  lastModifiedAt: noteData.lastModifiedAt,
                  createdAt: noteData.createdAt,
                  participantCount: payload.activeUsers.length,
                  activeParticipants,
                },
                workspaceId
              );
            } catch (metaError) {
              console.warn(
                "⚠️ 노트 메타데이터 조회 실패, 기본값 사용:",
                metaError
              );
              setCurrentNote(
                {
                  id: noteId,
                  title: payload.title || "Untitled",
                  content: useNoteStore.getState().content, // 이미 설정된 content 사용
                  workspaceId,
                  creatorId: 0,
                  creatorName: "Unknown",
                  creatorProfileImage: undefined,
                  lastModifiedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  participantCount: payload.activeUsers.length,
                  activeParticipants,
                },
                workspaceId
              );
            }

            // ⚠️ 주의: textarea.value는 updateContentFromYjs useEffect에서 자동 동기화됨
            // initializeYjs() 이후 Yjs content가 변경되면 useEffect에서 자동으로 업데이트됨

            // ✅ ENTER가 완전히 완료되었음을 표시
            // 이제 커서 업데이트를 안전하게 보낼 수 있음
            setIsEnterComplete(true);
          } catch (error) {
            console.error("❌ ENTER 메시지 처리 실패:", error);
            setError("노트 입장에 실패했습니다.");
            setIsEnterComplete(false);
          }
        };

        const handleSave = () => {
          console.log("💾 저장 완료");
          setAutoSaveStatus("saved");
          setTimeout(() => setAutoSaveStatus(""), 3000);
        };

        await wsService.subscribeToNoteEnter(noteId, handleEnter);
        wsService.subscribeToSave(noteId, handleSave);

        // Yjs Update 브로드캐스트 구독
        wsService.subscribeToYjsUpdates(noteId, (base64Update, userName) => {
          console.log(`📨 Yjs Update 수신: ${userName}`);
          const state = useNoteStore.getState();
          const yDoc = state.getYDoc();

          if (yDoc) {
            try {
              // Base64를 Uint8Array로 디코딩
              const binaryStr = atob(base64Update);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }

              // Y.Doc에 Update 적용
              console.log(`🔄 원격 Update 적용: ${userName}`);
              Y.applyUpdate(yDoc, bytes);
            } catch (error) {
              console.error("❌ 원격 Update 적용 실패:", error);
            }
          }
        });

        // 원격 커서 위치 구독
        wsService.subscribeToCursors(noteId, (cursor) => {
          // ⚠️ 자신의 커서는 저장하지 않음 (자신은 localCursorPosition으로 관리)
          if (cursor.workspaceMemberId === currentUserWorkspaceMemberId) {
            console.log(`⏭️ 자신의 커서이므로 무시:`, cursor.workspaceMemberId);
            return;
          }

          console.log(`📍 다른 사용자 커서 수신:`, cursor);
          const state = useNoteStore.getState();
          state.updateCursorPosition(
            cursor.workspaceMemberId,
            cursor.position,
            cursor.range,
            cursor.color,
            cursor.userName,
            cursor.profileImage
          );
        });

        // Yjs Update 전송 이벤트 리스너 등록
        const handleYjsUpdateReady = (event: Event) => {
          const customEvent = event as CustomEvent;
          const { base64Update, noteId: eventNoteId } = customEvent.detail;
          console.log(`✅ CustomEvent 'yjsUpdateReady' 수신`, {
            noteId: eventNoteId,
            updateSize: base64Update?.length,
            connected: wsService.getIsConnected(),
          });

          if (!wsService.getIsConnected()) {
            console.warn("⚠️ WebSocket 미연결 - Update 전송 불가");
            return;
          }

          if (base64Update) {
            console.log(
              `📤 Yjs Update 서버 전송: ${base64Update.length} bytes`
            );
            wsService.sendYjsUpdate(noteId, base64Update);
          } else {
            console.warn("⚠️ base64Update가 없음");
          }
        };
        window.addEventListener("yjsUpdateReady", handleYjsUpdateReady);

        // cleanup 함수에서 제거할 수 있도록 ref에 저장
        (
          wsServiceRef as unknown as {
            handleYjsUpdateReady: typeof handleYjsUpdateReady;
          }
        ).handleYjsUpdateReady = handleYjsUpdateReady;

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
      // Yjs Update 이벤트 리스너 제거
      const handler = (
        wsServiceRef as unknown as {
          handleYjsUpdateReady?: (event: Event) => void;
        }
      ).handleYjsUpdateReady;
      if (handler) {
        window.removeEventListener("yjsUpdateReady", handler);
      }

      // ENTER 완료 상태 초기화
      setIsEnterComplete(false);

      wsServiceRef.current.unsubscribeFromNote(noteId, () => {
        console.log("🔌 노트 퇴장 완료");
      });
    };
  }, [
    noteId,
    workspaceId,
    memberId,
    currentUserWorkspaceMemberId,
    setCurrentNote,
    initializeYjs,
    setError,
    setLoading,
  ]);

  // 자동 저장 (Yjs 동기화 상태에 따른 UI 업데이트)
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (syncStatus === "syncing") {
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
          } as React.ChangeEvent<HTMLTextAreaElement>);
        }
      }
    });
  };

  // 로컬 커서 위치 추적
  const handleCursorChange = () => {
    if (!textEditorRef.current) return;

    const position = textEditorRef.current.selectionStart;
    const range = textEditorRef.current.selectionEnd - position;

    console.log(
      `📍 로컬 커서 위치: position=${position}, range=${range}, isEnterComplete=${isEnterComplete}`
    );
    setLocalCursorPosition(position, range);

    // ⚠️ ENTER가 완전히 완료되지 않았으면 커서 전송을 스킵
    // 이렇게 하면 "노트에 먼저 입장해주세요" 에러를 피할 수 있음
    if (!isEnterComplete) {
      console.warn(
        "⏳ ENTER가 아직 완료되지 않아 커서 전송 미연기: position=" + position
      );
      return;
    }

    // 서버로 커서 위치 전송 (다른 사용자가 내 커서를 볼 수 있도록)
    console.log(`📤 커서 서버로 전송: position=${position}, range=${range}`);
    wsServiceRef.current.sendCursor(noteId, position, range);
  };

  // 텍스트 변경 핸들러 (Yjs 직접 편집)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) {
      console.log("⏭️ IME 조합 중 - 무시");
      return;
    }

    const newContent = e.currentTarget.value;
    const oldContent = lastContentRef.current;

    if (newContent === oldContent) {
      return;
    }

    console.log("📝 텍스트 변경 감지");

    const diff = calculateDiff(oldContent, newContent);
    if (!diff) {
      console.log("ℹ️ diff 없음");
      return;
    }

    console.log("🎯 Diff:", diff);
    lastContentRef.current = newContent;

    // Yjs에 직접 적용 (WebsocketProvider가 자동으로 전송)
    const yDoc = getYDoc();
    const yText = getYText();

    if (!yDoc || !yText) {
      console.warn("⚠️ Yjs 초기화되지 않음");
      return;
    }

    try {
      if (diff.type === "insert") {
        console.log(
          `📤 Yjs insert: position=${diff.position}, content="${diff.content}"`
        );
        // ⚠️ yDoc.transact()를 사용하여 로컬 변경임을 표시
        // transact 내의 모든 변경이 origin='local'이 됨
        yDoc.transact(() => {
          yText!.insert(diff.position, diff.content!);
        }, "local");
      } else if (diff.type === "delete") {
        console.log(
          `📤 Yjs delete: position=${diff.position}, length=${diff.length}`
        );
        // ⚠️ yDoc.transact()를 사용하여 로컬 변경임을 표시
        yDoc.transact(() => {
          yText!.delete(diff.position, diff.length);
        }, "local");
      }
    } catch (err) {
      console.error("❌ Yjs 편집 실패:", err);
      setError("편집 중 오류 발생");
    }
  };

  // TextArea 위치에서 픽셀 좌표 계산
  const getCoordinatesForPosition = (
    position: number,
    textareaElement: HTMLTextAreaElement
  ): { x: number; y: number } => {
    const { scrollTop } = textareaElement;
    const styles = window.getComputedStyle(textareaElement);

    // 보이지 않는 div를 생성하여 좌표 계산
    const div = document.createElement("div");
    const span = document.createElement("span");

    // TextArea와 동일한 스타일 적용
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.font = styles.font;
    div.style.padding = styles.padding;
    div.style.lineHeight = styles.lineHeight;
    div.style.letterSpacing = styles.letterSpacing;
    div.style.width =
      textareaElement.offsetWidth -
      (parseFloat(styles.paddingLeft) || 0) -
      (parseFloat(styles.paddingRight) || 0) +
      "px";

    // position까지의 텍스트 + span 추가
    const textBeforeCursor = content.substring(0, position);
    div.textContent = textBeforeCursor;
    div.appendChild(span);

    document.body.appendChild(div);

    const coordinates = {
      x: span.offsetLeft || 0,
      y: span.offsetTop || 0,
    };

    document.body.removeChild(div);

    return {
      x: coordinates.x,
      y: coordinates.y - scrollTop + 12,
    };
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

  // 제목 수정 핸들러
  const handleTitleSave = async (newTitle: string) => {
    if (!newTitle.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    try {
      console.log("📝 제목 변경 요청:", { workspaceId, noteId, newTitle });
      await patchNoteTitle(workspaceId, noteId, newTitle);
      console.log("✅ 제목 변경 성공");

      // currentNote 업데이트
      const updatedNote = {
        ...currentNote!,
        title: newTitle,
      };
      setCurrentNote(updatedNote, workspaceId);

      // 제목 수정 모드 종료
      setIsEditingTitle(false);

      // 부모 컴포넌트의 title 상태도 업데이트
      if (setTitle) {
        setTitle(newTitle);
      }

      // 목록 새로고침 콜백 호출
      if (onTitleUpdated) {
        onTitleUpdated();
      }

      // title 상태 초기화
      if (setTitle) {
        setTitle("");
      }
    } catch (error) {
      console.error("❌ 제목 변경 실패:", error);
      setError("제목을 변경할 수 없습니다.");
    }
  };

  // 제목 수정 시작
  const handleStartEditingTitle = () => {
    if (currentNote?.title && setTitle) {
      setTitle(currentNote.title);
    }
    setIsEditingTitle(true);
  };

  // 제목 수정 취소
  const handleCancelEditingTitle = () => {
    setIsEditingTitle(false);

    // title 상태 초기화
    if (setTitle) {
      setTitle("");
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
    <>
      {isEditingTitle ? (
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
              value={setTitle ? title : currentNote.title}
              onChange={(e) => {
                if (setTitle) setTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newTitle = setTitle ? title : currentNote.title;
                  handleTitleSave(newTitle);
                }
              }}
              autoFocus
            />

            {/* 버튼 */}
            <Button
              colorType="sub"
              onClick={() =>
                handleTitleSave(setTitle ? title : currentNote.title)
              }
              disabled={!(setTitle ? title : currentNote.title).trim()}
              iconName="Check_round"
              title="저장"
            />
            <Button
              colorType="sub"
              iconName="Close_White"
              onClick={handleCancelEditingTitle}
            />
          </div>

          {/* 프리뷰 */}
          <div className="flex-1 bg-white rounded-b-[8px] p-4 border-l border-r border-b border-[#E0E0E0] overflow-auto text-[#828282] text-center flex items-center justify-center">
            <p>노트 제목을 수정합니다</p>
          </div>
        </div>
      ) : (
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
            <p className="text-[14px] text-[#828282] text-nowrap">
              {currentNote.creatorName}
            </p>
            <p className="text-[16px] font-semibold flex-1 overflow-hidden text-ellipsis text-nowrap">
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
              onClick={handleStartEditingTitle}
            />
          </div>

          <div className="flex items-center justify-between gap-2 p-2 bg-white border-r border-l border-b border-[#E0E0E0]">
            <div className="flex items-center">
              <p
                className={`w-[60px] text-center text-[12px] cursor-pointer  border-[#E0E0E0]   rounded-[4px] rounded-r-none px-2 py-1 ${
                  isMarkDownMode
                    ? "font-bold bg-white border"
                    : "text-[#828282] border-l border-t border-b"
                }`}
                onClick={() => setIsMarkDownMode(true)}
              >
                Preview
              </p>
              <p
                className={`w-[60px] text-center text-[12px] cursor-pointer  border-[#E0E0E0]  rounded-[4px] rounded-l-none px-2 py-1 ${
                  isMarkDownMode
                    ? "text-[#828282] border-r border-t border-b"
                    : "font-bold bg-white border"
                }`}
                onClick={() => setIsMarkDownMode(false)}
              >
                Text
              </p>
            </div>
          </div>

          {/* 에디터 */}
          {isMarkDownMode ? (
            <div className="flex-1">
              <div className="h-full bg-white rounded-b-[8px] px-4 py-3 border-l border-r border-b border-[#E0E0E0] overflow-auto">
                <Markdown
                  components={{
                    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
                      <h1 className="text-[20px] font-bold my-2" {...props} />
                    ),
                    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
                      <h2 className="text-[18px] font-bold my-2" {...props} />
                    ),
                    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
                      <p className="my-2 leading-6" {...props} />
                    ),
                    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
                      <ul className="list-disc pl-5 my-2" {...props} />
                    ),
                    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
                      <ol className="list-decimal pl-5 my-2" {...props} />
                    ),
                    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
                      <li className="my-1" {...props} />
                    ),
                    code: (props: React.HTMLAttributes<HTMLElement>) => (
                      <code
                        className="bg-[#f5f5f5] px-1 py-0.5 rounded"
                        {...props}
                      />
                    ),
                    blockquote: (
                      props: React.HTMLAttributes<HTMLQuoteElement>
                    ) => (
                      <blockquote
                        className="border-l-4 border-[#E0E0E0] pl-3 italic text-[#4f4f4f] my-2"
                        {...props}
                      />
                    ),
                  }}
                >
                  {content || ""}
                </Markdown>
              </div>
            </div>
          ) : (
            <div className="relative flex-1 bg-white rounded-b-[8px] border-l border-r border-b border-[#E0E0E0]">
              {/* 다른 사용자들의 커서 표시 (자신의 커서는 숨김) */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                {/* 자신의 커서는 표시하지 않음 */}

                {/* 다른 사용자들의 커서 */}
                {Array.from(cursors.values())
                  .filter(
                    (cursor) =>
                      cursor.workspaceMemberId !== currentUserWorkspaceMemberId
                  )
                  .map((cursor) => {
                    const coordinates = textEditorRef.current
                      ? getCoordinatesForPosition(
                          cursor.position,
                          textEditorRef.current
                        )
                      : { x: 0, y: 0 };

                    return (
                      <div
                        key={`cursor-${cursor.workspaceMemberId}`}
                        className="absolute flex items-center gap-2 pointer-events-auto"
                        style={{
                          left: `${coordinates.x}px`,
                          top: `${coordinates.y}px`,
                          transform: "translateY(-50%)",
                        }}
                        title={cursor.userName}
                      >
                        {/* 커서 라인 */}
                        <div
                          className="w-[2px] h-[20px] animate-pulse"
                          style={{ backgroundColor: cursor.color }}
                        />
                        {/* 프로필 사진 아바타 */}
                        <div
                          className="w-[28px] h-[28px] rounded-full border-2 flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md relative"
                          style={{ borderColor: cursor.color }}
                        >
                          {cursor.profileImage ? (
                            <img
                              src={cursor.profileImage}
                              alt={cursor.userName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // 이미지 로드 실패 시 폴백 - 다음 요소로 대체
                                e.currentTarget.style.display = "none";
                                // 첫글자 아바타 표시
                                const fallback =
                                  e.currentTarget.parentElement?.querySelector(
                                    '[data-fallback="true"]'
                                  );
                                if (fallback) {
                                  (fallback as HTMLElement).style.display =
                                    "flex";
                                }
                              }}
                            />
                          ) : null}
                          {/* 프로필 이미지 없거나 로드 실패 시 표시 */}
                          <div
                            data-fallback="true"
                            className="absolute inset-0 rounded-full flex items-center justify-center"
                            style={{
                              display: cursor.profileImage ? "none" : "flex",
                              background: `linear-gradient(135deg, ${cursor.color}44 0%, ${cursor.color}88 100%)`,
                            }}
                          >
                            <span className="text-white text-[12px] font-bold">
                              {cursor.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {/* 사용자 이름 배지 */}
                        <div
                          className="px-2 py-1 rounded text-white text-[11px] font-semibold whitespace-nowrap max-w-[120px] truncate"
                          style={{ backgroundColor: cursor.color }}
                        >
                          {cursor.userName}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <textarea
                ref={textEditorRef}
                onChange={handleTextChange}
                onSelect={handleCursorChange}
                onMouseUp={handleCursorChange}
                onKeyUp={handleCursorChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="h-full w-full bg-white px-4 py-3 overflow-auto resize-none font-mono outline-none relative z-10"
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DetailedNote;
