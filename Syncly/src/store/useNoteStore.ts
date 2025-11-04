import { create } from "zustand";
import { TNotes, TNoteParticipant, TCursorPosition } from "../shared/type/note";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

/**
 * Note 스토어 상태 타입 (Yjs CRDT 기반)
 */
export interface NoteStoreState {
  // 현재 편집 중인 노트
  currentNote: TNotes | null;
  currentNoteId: number | null;
  workspaceId: number | null;

  // Yjs CRDT 관련
  yDoc: Y.Doc | null;
  yText: Y.Text | null;
  provider: WebsocketProvider | null;
  awareness: Awareness | null;

  // 문서 내용 (yText.toString()으로 동기화)
  content: string;

  // 참여자 정보
  activeParticipants: TNoteParticipant[];
  cursors: Map<number, TCursorPosition>;

  // 상태
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  syncStatus: "synced" | "syncing"; // Yjs는 자동으로 처리하므로 간단함

  // 커서 위치 (현재 사용자)
  localCursorPosition: number;
  localCursorRange: number;
}

/**
 * Note 스토어 액션 타입 (Yjs CRDT 기반)
 */
export interface NoteStoreActions {
  // 초기화 및 설정
  setCurrentNote: (note: TNotes | null, workspaceId: number) => void;
  setWorkspaceId: (workspaceId: number) => void;

  // Yjs 초기화 및 정리
  initializeYjs: (
    noteId: number,
    yDocBinary: string | null,
    currentWorkspaceMemberId?: number
  ) => void;
  cleanupYjs: () => void;
  reset: () => void;

  // 문서 내용 업데이트 (Yjs를 통한 자동 동기화)
  updateContentFromYjs: (content: string) => void;

  // 참여자 관리
  setActiveParticipants: (participants: TNoteParticipant[]) => void;
  addParticipant: (participant: TNoteParticipant) => void;
  removeParticipant: (memberId: number) => void;

  // 커서 관리
  updateCursorPosition: (
    memberId: number,
    position: number,
    range: number,
    color?: string,
    userName?: string,
    profileImage?: string
  ) => void;
  setLocalCursorPosition: (position: number, range: number) => void;
  removeCursor: (memberId: number) => void;

  // 상태 관리
  setSaving: (saving: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSyncStatus: (status: "synced" | "syncing") => void;

  // Yjs 관련 getter
  getYText: () => Y.Text | null;
  getYDoc: () => Y.Doc | null;
}

export type NoteStore = NoteStoreState & NoteStoreActions;

const initialState: NoteStoreState = {
  currentNote: null,
  currentNoteId: null,
  workspaceId: null,
  yDoc: null,
  yText: null,
  provider: null,
  awareness: null,
  content: "",
  activeParticipants: [],
  cursors: new Map(),
  isSaving: false,
  isLoading: false,
  error: null,
  syncStatus: "synced",
  localCursorPosition: 0,
  localCursorRange: 0,
};

/**
 * Zustand Note 스토어
 */
export const useNoteStore = create<NoteStore>((set, get) => ({
  ...initialState,

  // ===== 초기화 및 설정 =====
  setCurrentNote: (note: TNotes | null, workspaceId: number) => {
    // 기존 Yjs 정리
    const current = get();
    if (current.provider) {
      current.provider.disconnect();
    }

    set({
      currentNote: note,
      currentNoteId: note?.id ?? null,
      workspaceId,
      activeParticipants: note?.activeParticipants ?? [],
      cursors: new Map(),
      error: null,
      syncStatus: "synced",
    });
  },

  setWorkspaceId: (workspaceId: number) => {
    set({ workspaceId });
  },

  // ===== Yjs 초기화 및 정리 =====
  initializeYjs: (
    noteId: number,
    yDocBinary: string | null,
    currentWorkspaceMemberId?: number
  ) => {
    const state = get();

    // 기존 Yjs 정리
    if (state.provider) {
      state.provider.disconnect();
    }
    if (state.yDoc) {
      state.yDoc.destroy();
    }

    // 새로운 Y.Doc 생성
    const yDoc = new Y.Doc();
    const yText = yDoc.getText("shared-text");

    // Y.Doc에 초기 상태 복원 (있으면)
    if (yDocBinary) {
      try {
        // 🔍 Step 1: Base64 디코딩
        console.log("🔍 [Step 1] Base64 디코딩 시작:", {
          inputSize: yDocBinary.length,
          first50chars: yDocBinary.substring(0, 50),
          last20chars: yDocBinary.substring(
            Math.max(0, yDocBinary.length - 20)
          ),
        });

        const binaryString = atob(yDocBinary);
        console.log("🔍 [Step 1] Base64 디코딩 완료:", {
          decodedStringLength: binaryString.length,
          firstCharCodes: Array.from(binaryString.slice(0, 10)).map((c) =>
            c.charCodeAt(0)
          ),
          lastCharCodes: Array.from(binaryString.slice(-10)).map((c) =>
            c.charCodeAt(0)
          ),
        });

        // 🔍 Step 2: Uint8Array 변환
        console.log("🔍 [Step 2] Uint8Array 변환 시작");
        const binaryUpdate = Uint8Array.from(binaryString, (c) =>
          c.charCodeAt(0)
        );
        console.log("🔍 [Step 2] Uint8Array 변환 완료:", {
          byteArrayLength: binaryUpdate.length,
          firstBytes: Array.from(binaryUpdate.slice(0, 10))
            .map((b) => "0x" + b.toString(16).padStart(2, "0"))
            .join(", "),
          lastBytes: Array.from(binaryUpdate.slice(-10))
            .map((b) => "0x" + b.toString(16).padStart(2, "0"))
            .join(", "),
        });

        // 🔍 Step 3: Y.Doc 적용 전 상태
        console.log("🔍 [Step 3] Y.Doc 적용 전 상태:", {
          yTextLength: yText.length,
          yTextContent: yText.toString(),
          yDocStateLength: Y.encodeStateAsUpdate(yDoc).length,
        });

        // 🔍 Step 4: Y.applyUpdate 실행
        console.log("🔍 [Step 4] Y.applyUpdate() 실행");
        Y.applyUpdate(yDoc, binaryUpdate);

        // 🔍 Step 5: Y.Doc 적용 후 상태
        const finalContent = yText.toString();
        console.log("🔍 [Step 5] Y.Doc 적용 후 상태:", {
          yTextLength: yText.length,
          yTextContent: finalContent,
          yDocStateLength: Y.encodeStateAsUpdate(yDoc).length,
        });

        console.log("✅ Y.Doc 복원 완료: ", finalContent);

        // ✅ 복원 후 초기 content 상태 설정
        const initialContent = yText.toString();
        console.log("📝 초기 content 설정:", {
          length: initialContent.length,
          preview: initialContent.substring(0, 100),
          fullContent: initialContent,
        });
        set({ content: initialContent });
      } catch (error) {
        console.error("❌ Y.Doc 복원 실패:", error);
        console.error("❌ Error details:", {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack,
        });
      }
    } else {
      console.log("⚠️ yDocBinary가 없음 (빈 노트)");
    }

    // yText 변경 감시 (자동 동기화 - 이후 변경사항)
    const yTextObserver = () => {
      const content = yText.toString();
      console.log("📝 Yjs 내용 변경 감지:", content);
      set({ content });
    };
    yText.observe(yTextObserver);

    // Y.Doc 전체 변경 감시 (Update 인코딩용)
    const yDocObserver = (update: Uint8Array, origin: string | null) => {
      console.log("🔍 Y.Doc Update 이벤트 발생:", {
        updateSize: update.length,
        origin,
        originType: typeof origin,
      });

      // origin이 null이면 원격 변경이므로 무시
      // origin이 null이 아니면 로컬 변경
      if (origin !== null) {
        console.log("📤 로컬 Yjs 변경 감지, 전체 상태 인코딩");
        try {
          // ✅ FIX: 증분 업데이트 대신 전체 Y.Doc 상태를 인코딩
          // 이렇게 하면 Redis/DB에 저장할 때 완전한 문서 상태가 보존됨
          const fullState = Y.encodeStateAsUpdate(yDoc);
          const base64Update = btoa(
            String.fromCharCode.apply(null, Array.from(fullState))
          );
          console.log("🔄 Base64 Update 생성 (전체 상태):", {
            size: base64Update.length,
          });

          // 서버로 전송하도록 이벤트 발생 (DetailedNote에서 처리)
          console.log("🎯 CustomEvent 'yjsUpdateReady' 발생");
          window.dispatchEvent(
            new CustomEvent("yjsUpdateReady", {
              detail: { base64Update, noteId },
            })
          );
        } catch (error) {
          console.error("❌ Update 인코딩 실패:", error);
        }
      } else {
        console.log("⏭️ 원격 변경이므로 무시 (origin=null)");
      }
    };
    yDoc.on("update", yDocObserver);

    // ℹ️ WebsocketProvider 제거 (STOMP 기반 동기화로 전환)
    // y-websocket은 우리 백엔드 프로토콜과 호환되지 않으므로 사용하지 않음
    // 대신 수동 STOMP 동기화와 Awareness를 사용

    // 로컬 Awareness 생성 (커서 동기화용)
    const awareness = new Awareness(yDoc);

    // 현재 사용자 정보 찾기
    const { localCursorPosition, localCursorRange, currentNote } = state;
    const currentUserData = currentNote?.activeParticipants?.find(
      (p) => p.memberId === currentWorkspaceMemberId
    );

    // 현재 사용자의 Awareness 상태 설정 (로컬 커서)
    awareness.setLocalState({
      user: {
        name: currentUserData?.memberName || "Unknown",
        profileImage: currentUserData?.profileImage || null,
      },
      cursor: {
        memberId: currentWorkspaceMemberId || 0,
        position: localCursorPosition,
        range: localCursorRange,
        color: currentUserData?.color || "#3B82F6",
      },
    });

    // Awareness 변경 감시 (원격 커서 동기화)
    // 주의: 이것은 로컬 Awareness 변경만 감시
    // 원격 커서는 STOMP 메시지로 처리됨
    const awarenessObserver = ({
      added,
      updated,
    }: {
      added: number[];
      updated: number[];
    }) => {
      const cursors = new Map(state.cursors);

      // 추가 또는 업데이트된 사용자 (로컬만)
      [...added, ...updated].forEach((clientId: number) => {
        const clientAwareness = awareness.getStates().get(clientId);
        if (clientAwareness?.cursor && clientId === awareness.clientID) {
          // 로컬 사용자만 처리
          const { memberId, position, range, color } = clientAwareness.cursor;
          if (memberId !== null) {
            cursors.set(memberId, {
              workspaceMemberId: memberId,
              position,
              range,
              userName: clientAwareness.user?.name || "Unknown",
              profileImage: clientAwareness.user?.profileImage || null,
              color: color || "#000000",
            });
          }
        }
      });

      set({ cursors });
    };
    awareness.on("change", awarenessObserver);

    set({
      yDoc,
      yText,
      provider: null, // y-websocket 미사용
      awareness,
      content: yText.toString(),
      syncStatus: "syncing",
    });

    console.log("✅ Yjs 초기화 완료: noteId =", noteId);
  },

  cleanupYjs: () => {
    const state = get();
    if (state.provider) {
      state.provider.disconnect();
    }
    if (state.yDoc) {
      state.yDoc.destroy();
    }
    set({
      yDoc: null,
      yText: null,
      provider: null,
      awareness: null,
      content: "",
    });
  },

  reset: () => {
    get().cleanupYjs();
    set(initialState);
  },

  // ===== 문서 내용 업데이트 (Yjs를 통한 자동 동기화) =====
  updateContentFromYjs: (content: string) => {
    set({ content, syncStatus: "synced" });
  },

  // ===== 참여자 관리 =====
  setActiveParticipants: (participants: TNoteParticipant[]) => {
    set({ activeParticipants: participants });
  },

  addParticipant: (participant: TNoteParticipant) => {
    set((prevState) => {
      const exists = prevState.activeParticipants.some(
        (p) => p.memberId === participant.memberId
      );
      if (exists) return {};

      return {
        activeParticipants: [...prevState.activeParticipants, participant],
      };
    });
  },

  removeParticipant: (memberId: number) => {
    set((prevState) => ({
      activeParticipants: prevState.activeParticipants.filter(
        (p) => p.memberId !== memberId
      ),
      cursors: new Map(
        Array.from(prevState.cursors).filter(([key]) => key !== memberId)
      ),
    }));
  },

  // ===== 커서 관리 =====
  updateCursorPosition: (
    memberId: number,
    position: number,
    range: number,
    color?: string,
    userName?: string,
    profileImage?: string
  ) => {
    set((prevState) => {
      const newCursors = new Map(prevState.cursors);
      const participant = prevState.activeParticipants.find(
        (p) => p.memberId === memberId
      );

      // activeParticipants에 있으면 그 정보를 사용하고, 없으면 전달받은 정보를 사용
      const finalUserName = userName || participant?.memberName || "Unknown";
      const finalProfileImage = profileImage ?? participant?.profileImage;
      const finalColor = color ?? participant?.color ?? "#000000";

      newCursors.set(memberId, {
        position,
        range,
        workspaceMemberId: memberId,
        userName: finalUserName,
        profileImage: finalProfileImage,
        color: finalColor,
      });

      return { cursors: newCursors };
    });
  },

  setLocalCursorPosition: (position: number, range: number) => {
    const state = get();
    set({ localCursorPosition: position, localCursorRange: range });

    // Awareness 업데이트
    if (state.awareness) {
      const currentState = state.awareness.getLocalState() || {};
      state.awareness.setLocalState({
        ...currentState,
        cursor: {
          ...currentState.cursor,
          position,
          range,
        },
      });
    }
  },

  removeCursor: (memberId: number) => {
    set((prevState) => {
      const newCursors = new Map(prevState.cursors);
      newCursors.delete(memberId);
      return { cursors: newCursors };
    });
  },

  // ===== 상태 관리 =====
  setSaving: (saving: boolean) => {
    set({ isSaving: saving });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setSyncStatus: (status: "synced" | "syncing") => {
    set({ syncStatus: status });
  },

  // ===== Yjs 관련 getter =====
  getYText: () => {
    return get().yText;
  },

  getYDoc: () => {
    return get().yDoc;
  },
}));
