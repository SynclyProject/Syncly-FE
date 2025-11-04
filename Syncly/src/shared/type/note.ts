// ✅ 사용되지 않는 TUser import 제거 (레거시 호환성 필드 삭제됨)

/**
 * Note 기본 타입 (목록, 상세 조회) - Yjs CRDT 기반
 *
 * <p>Yjs CRDT로 전환되면서:
 * - content 필드는 API의 ydocBinary(Base64)가 전달됨 (HTTP는 binary를 직접 전송 불가)
 * - 프론트엔드에서 content ← ydocBinary → Yjs로 복원
 * - OT 기반 revision/version 개념 제거
 */
export type TNotes = {
  id: number;
  title: string;
  content: string; // ✅ 실제로는 ydocBinary(Base64)가 전달됨
  workspaceId: number;
  creatorId: number;
  creatorName: string;
  creatorProfileImage?: string;
  lastModifiedAt: string;
  createdAt: string;
  participantCount: number;
  activeParticipants?: TNoteParticipant[];
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
 * 노트 저장 응답 (Yjs CRDT 기반)
 *
 * <p>Yjs는 CRDT 기반이므로 revision 개념이 없습니다.
 * 자동으로 충돌을 해결하므로 버전 관리가 필요 없습니다.
 */
export type TNoteSaveResponse = {
  success: boolean;
  savedAt: string;
  message: string;
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
 * 활성 사용자 정보
 */
export type TActiveUserInfo = {
  workspaceMemberId: number;
  userName: string;
  profileImage?: string;
  color: string;
};

/**
 * ENTER 페이로드
 */
export type TEnterPayload = {
  noteId: number;
  title: string;
  ydocBinary: string;
  activeUsers: TActiveUserInfo[];
  currentUserWorkspaceMemberId: number; // 현재 입장한 사용자의 WorkspaceMember ID
  timestamp: string;
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
  timestamp: string;
};
