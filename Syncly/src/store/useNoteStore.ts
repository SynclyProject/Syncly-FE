import { create } from "zustand";
import {
  TNotes,
  TNoteParticipant,
  TEditOperation,
  TCursorPosition,
} from "../shared/type/note";
import { transformAgainstHistory, applyOperation } from "./ot-engine";

/**
 * Note 스토어 상태 타입
 */
export interface NoteStoreState {
  // 현재 편집 중인 노트
  currentNote: TNotes | null;
  currentNoteId: number | null;
  workspaceId: number | null;

  // 문서 내용 및 버전
  content: string;
  revision: number;

  // 참여자 정보
  activeParticipants: TNoteParticipant[];
  cursors: Map<number, TCursorPosition>;

  // 편집 히스토리
  operations: TEditOperation[];
  pendingOperations: TEditOperation[]; // 아직 서버에서 확인 안 된 로컬 연산

  // 상태
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  syncStatus: "synced" | "pending" | "conflict"; // 동기화 상태

  // 커서 위치 (현재 사용자)
  localCursorPosition: number;
  localCursorRange: number;
}

/**
 * Note 스토어 액션 타입
 */
export interface NoteStoreActions {
  // 초기화 및 설정
  setCurrentNote: (note: TNotes | null, workspaceId: number) => void;
  setWorkspaceId: (workspaceId: number) => void;
  reset: () => void;

  // 문서 내용 업데이트
  setContent: (content: string, revision: number) => void;
  applyLocalOperation: (operation: Omit<TEditOperation, "revision">) => void;
  applyRemoteOperation: (operation: TEditOperation) => void;

  // 히스토리 관리
  addOperation: (operation: TEditOperation, isRemote: boolean) => void;
  clearOperations: () => void;

  // 참여자 관리
  setActiveParticipants: (participants: TNoteParticipant[]) => void;
  addParticipant: (participant: TNoteParticipant) => void;
  removeParticipant: (memberId: number) => void;

  // 커서 관리
  updateCursorPosition: (
    memberId: number,
    position: number,
    range: number,
    color?: string
  ) => void;
  setLocalCursorPosition: (position: number, range: number) => void;
  removeCursor: (memberId: number) => void;

  // 상태 관리
  setSaving: (saving: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSyncStatus: (status: "synced" | "pending" | "conflict") => void;

  // 동기화
  handleRemoteEdit: (operation: TEditOperation) => void;
  resyncFromServer: (content: string, revision: number) => void;
}

export type NoteStore = NoteStoreState & NoteStoreActions;

const initialState: NoteStoreState = {
  currentNote: null,
  currentNoteId: null,
  workspaceId: null,
  content: "",
  revision: 0,
  activeParticipants: [],
  cursors: new Map(),
  operations: [],
  pendingOperations: [],
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
    set({
      currentNote: note,
      currentNoteId: note?.id ?? null,
      workspaceId,
      content: note?.content ?? "",
      revision: 0,
      activeParticipants: note?.activeParticipants ?? [],
      cursors: new Map(),
      operations: [],
      pendingOperations: [],
      error: null,
      syncStatus: "synced",
    });
  },

  setWorkspaceId: (workspaceId: number) => {
    set({ workspaceId });
  },

  reset: () => {
    set(initialState);
  },

  // ===== 문서 내용 업데이트 =====
  setContent: (content: string, revision: number) => {
    set({ content, revision, syncStatus: "synced" });
  },

  applyLocalOperation: (operation: Omit<TEditOperation, "revision">) => {
    const state = get();
    const revision = state.revision;
    const newContent = applyOperation(state.content, {
      ...operation,
      revision,
    });

    const fullOperation: TEditOperation = {
      ...operation,
      revision,
    };

    set((prevState) => ({
      content: newContent,
      pendingOperations: [...prevState.pendingOperations, fullOperation],
      revision: prevState.revision + 1,
      syncStatus: "pending",
    }));
  },

  applyRemoteOperation: (operation: TEditOperation) => {
    const state = get();

    // 📋 상세 로그: 원본 operation과 pending operations 상태
    console.log("🔄 applyRemoteOperation 시작:", {
      operation: {
        type: operation.type,
        position: operation.position,
        length: operation.length,
        content: operation.content ? JSON.stringify(operation.content.substring(0, 20)) : undefined,
        revision: operation.revision,
        workspaceMemberId: operation.workspaceMemberId,
      },
      currentRevision: state.revision,
      contentLength: state.content.length,
      pendingOpCount: state.pendingOperations.length,
      pendingOps: state.pendingOperations.map((op) => ({
        type: op.type,
        position: op.position,
        length: op.length,
        revision: op.revision,
      })),
    });

    // Pending 연산들에 대해 변환
    const transformedOp = transformAgainstHistory(operation, [
      ...state.pendingOperations,
    ]);

    console.log("🔄 OT 변환 완료:", {
      original: {
        position: operation.position,
        length: operation.length,
        type: operation.type,
      },
      transformed: {
        position: transformedOp.position,
        length: transformedOp.length,
        type: transformedOp.type,
      },
      contentLength: state.content.length,
      isValid: transformedOp.position >= 0 && transformedOp.position <= state.content.length,
    });

    // ⚠️ 위치 검증: operation position이 유효한 범위인지 확인
    if (transformedOp.position < 0 || transformedOp.position > state.content.length) {
      console.warn("❌ Invalid operation position - 자세한 정보:", {
        position: transformedOp.position,
        contentLength: state.content.length,
        operation: {
          type: transformedOp.type,
          position: transformedOp.position,
          length: transformedOp.length,
          revision: transformedOp.revision,
        },
        content: state.content.substring(0, 100),
        pendingOperations: state.pendingOperations.map((op) => ({
          type: op.type,
          position: op.position,
          length: op.length,
          revision: op.revision,
        })),
      });
    }

    const newContent = applyOperation(state.content, transformedOp);

    set((prevState) => ({
      content: newContent,
      revision: prevState.revision + 1,
      operations: [...prevState.operations, transformedOp].slice(-100), // 최근 100개만 유지
      syncStatus: prevState.pendingOperations.length > 0 ? "pending" : "synced",
    }));
  },

  // ===== 히스토리 관리 =====
  addOperation: (operation: TEditOperation, isRemote: boolean) => {
    set((prevState) => ({
      operations: [...prevState.operations, operation].slice(-100), // 최근 100개만 유지
    }));

    if (isRemote) {
      get().applyRemoteOperation(operation);
    }
  },

  clearOperations: () => {
    set({ operations: [], pendingOperations: [] });
  },

  // ===== 참여자 관리 =====
  setActiveParticipants: (participants: TNoteParticipant[]) => {
    set({
      activeParticipants: participants,
    });
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
    color?: string
  ) => {
    set((prevState) => {
      const newCursors = new Map(prevState.cursors);
      const participant = prevState.activeParticipants.find(
        (p) => p.memberId === memberId
      );

      if (participant) {
        newCursors.set(memberId, {
          position,
          range,
          workspaceMemberId: memberId,
          userName: participant.memberName,
          profileImage: participant.profileImage,
          color: color ?? participant.color ?? "#000000",
        });
      }

      return { cursors: newCursors };
    });
  },

  setLocalCursorPosition: (position: number, range: number) => {
    set({ localCursorPosition: position, localCursorRange: range });
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

  setSyncStatus: (status: "synced" | "pending" | "conflict") => {
    set({ syncStatus: status });
  },

  // ===== 동기화 =====
  handleRemoteEdit: (operation: TEditOperation) => {
    const state = get();

    // Pending 연산이 있다면 변환 필요
    if (state.pendingOperations.length > 0) {
      // 서버의 revision이 우리의 마지막 pending revision보다 크면 conflict
      const lastPendingRevision =
        state.pendingOperations[state.pendingOperations.length - 1].revision;

      if (operation.revision > lastPendingRevision) {
        // Conflict: 로컬 pending을 서버 operation에 대해 변환
        const transformedPending = state.pendingOperations.map((pendingOp) =>
          transformAgainstHistory(pendingOp, [operation])
        );

        set({
          pendingOperations: transformedPending,
          syncStatus: "conflict",
        });
      }
    }

    // 연산 적용
    get().applyRemoteOperation(operation);
  },

  resyncFromServer: (content: string, revision: number) => {
    set({
      content,
      revision,
      pendingOperations: [], // 모든 pending 초기화
      syncStatus: "synced",
      error: null,
    });
  },
}));
