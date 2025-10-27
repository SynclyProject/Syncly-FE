import { TUser } from "./FilesType";

/**
 * Note 기본 타입 (목록, 상세 조회)
 */
export type TNotes = {
  id: number;
  title: string;
  content: string;
  workspaceId: number;
  creatorId: number;
  creatorName: string;
  creatorProfileImage?: string;
  lastModifiedAt: string;
  createdAt: string;
  participantCount: number;
  activeParticipants?: TNoteParticipant[];
  // 레거시 호환성
  date?: string;
  user?: TUser;
};

/**
 * Note 참여자 정보
 */
export type TNoteParticipant = {
  memberId: number;
  memberName: string;
  profileImage?: string;
  isOnline: boolean;
  joinedAt: string;
  color?: string; // 커서/선택 색상
};

/**
 * 노트 생성 요청
 */
export type TNoteCreateRequest = {
  title: string;
};

/**
 * 노트 생성 응답
 */
export type TNoteCreateResponse = {
  id: number;
  title: string;
  workspaceId: number;
  creatorName: string;
  createdAt: string;
};

/**
 * 노트 목록 조회 응답
 */
export type TNoteListResponse = {
  notes: TNotes[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

/**
 * 노트 저장 응답
 */
export type TNoteSaveResponse = {
  success: boolean;
  revision: number;
  savedAt: string;
  message: string;
};

/**
 * 편집 연산 (OT)
 */
export type TEditOperation = {
  type: "insert" | "delete";
  position: number;
  length: number;
  content?: string; // insert 시만
  revision: number;
  workspaceMemberId: number;
  timestamp: string;
};

/**
 * 커서 위치 정보
 */
export type TCursorPosition = {
  position: number;
  range: number;
  workspaceMemberId: number;
  userName: string;
  profileImage?: string;
  color: string;
};

/**
 * WebSocket 메시지 타입
 */
export type TWebSocketMessageType =
  | "ENTER"
  | "LEAVE"
  | "EDIT"
  | "CURSOR"
  | "SAVE"
  | "ERROR";

/**
 * WebSocket 메시지 (제네릭)
 */
export type TWebSocketMessage<T = unknown> = {
  type: TWebSocketMessageType;
  payload: T;
  workspaceMemberId: number | null;
  timestamp: string;
};

/**
 * ENTER 페이로드
 */
export type TEnterPayload = {
  noteId: number;
  creatorName: string;
  creatorProfileImage: string;
  revision: number;
  activeUsers: number[];
  cursors: Record<number, TCursorPosition>;
  timestamp: string;
};

/**
 * EDIT 페이로드
 */
export type TEditPayload = {
  operation: TEditOperation;
  content?: string; // 10번째 연산마다만
  revision: number;
  userName: string;
  timestamp: string;
  includesFullContent: boolean;
};

/**
 * CURSOR 페이로드
 */
export type TCursorPayload = TCursorPosition & {
  timestamp: string;
};

/**
 * SAVE 페이로드
 */
export type TSavePayload = {
  revision: number;
  savedAt: string;
  message: string;
};

/**
 * ERROR 페이로드
 */
export type TErrorPayload = {
  code: string;
  message: string;
  content?: string; // 동기화용
  revision?: number;
  timestamp: string;
};
