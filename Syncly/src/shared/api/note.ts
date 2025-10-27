import { axiosInstance } from "./common/axiosInstance";
import {
  TNotes,
  TNoteCreateRequest,
  TNoteCreateResponse,
  TNoteListResponse,
  TNoteSaveResponse,
} from "../type/note";

const API_BASE = "/api/workspaces";

/**
 * 노트 생성
 * @param workspaceId 워크스페이스 ID
 * @param request 노트 생성 요청
 * @returns 생성된 노트 정보
 */
export const createNote = async (
  workspaceId: number,
  request: TNoteCreateRequest
): Promise<TNoteCreateResponse> => {
  const { data } = await axiosInstance.post(
    `${API_BASE}/${workspaceId}/notes`,
    request
  );

  console.log("📨 createNote 응답:", data);

  // 응답 형식: { isSuccess: true, code: "201", message: "OK", result: { id, title, ... } }
  if (data?.result) {
    return data.result;
  }

  // Fallback: 이전 형식
  if (data?.data) {
    return data.data;
  }

  // Fallback: 직접 데이터
  if (data?.id) {
    return data;
  }

  console.error("❌ 예상치 못한 응답 형식:", data);
  throw new Error("노트 생성 응답 형식이 예상과 다릅니다");
};

/**
 * 노트 목록 조회 (페이징)
 * @param workspaceId 워크스페이스 ID
 * @param page 페이지 번호 (0-based)
 * @param size 페이지 크기
 * @param sortBy 정렬 기준 (createdAt, lastModifiedAt 등)
 * @param direction 정렬 방향 (asc, desc)
 * @returns 노트 목록 및 페이징 정보
 */
export const getNoteList = async (
  workspaceId: number,
  page: number = 0,
  size: number = 20,
  sortBy: string = "lastModifiedAt",
  direction: string = "desc"
): Promise<TNoteListResponse> => {
  const { data } = await axiosInstance.get(`${API_BASE}/${workspaceId}/notes`, {
    params: { page, size, sortBy, direction },
  });

  console.log("📨 getNoteList 응답:", data);

  // 응답 형식: { isSuccess: true, code: "200", message: "OK", result: { notes, totalCount, ... } }
  if (data?.result) {
    return data.result;
  }

  // Fallback: 이전 형식
  if (data?.data) {
    return data.data;
  }

  // Fallback: 직접 notes 배열이 있는 경우
  if (data?.notes) {
    return data;
  }

  // 에러
  console.error("❌ 예상치 못한 응답 형식:", data);
  throw new Error("노트 목록 조회 응답 형식이 예상과 다릅니다");
};

/**
 * 노트 상세 조회
 * @param workspaceId 워크스페이스 ID
 * @param noteId 노트 ID
 * @returns 노트 상세 정보
 */
export const getNoteDetail = async (
  workspaceId: number,
  noteId: number
): Promise<TNotes> => {
  const { data } = await axiosInstance.get(
    `${API_BASE}/${workspaceId}/notes/${noteId}`
  );

  console.log("📨 getNoteDetail 응답:", data);

  if (data?.result) {
    return data.result;
  }
  if (data?.data) {
    return data.data;
  }

  throw new Error("노트 상세 조회 응답 형식이 예상과 다릅니다");
};

/**
 * 노트 삭제 (소프트 삭제)
 * @param workspaceId 워크스페이스 ID
 * @param noteId 노트 ID
 * @returns 삭제 결과
 */
export const deleteNote = async (
  workspaceId: number,
  noteId: number
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axiosInstance.delete(
    `${API_BASE}/${workspaceId}/notes/${noteId}`
  );

  console.log("📨 deleteNote 응답:", data);

  if (data?.result) {
    return data.result;
  }
  if (data?.data) {
    return data.data;
  }

  return { success: true, message: "노트가 삭제되었습니다" };
};

/**
 * 노트 수동 저장
 * @param workspaceId 워크스페이스 ID
 * @param noteId 노트 ID
 * @returns 저장 결과
 */
export const saveNote = async (
  workspaceId: number,
  noteId: number
): Promise<TNoteSaveResponse> => {
  const { data } = await axiosInstance.post(
    `${API_BASE}/${workspaceId}/notes/${noteId}/save`
  );

  console.log("📨 saveNote 응답:", data);

  if (data?.result) {
    return data.result;
  }
  if (data?.data) {
    return data.data;
  }

  throw new Error("노트 저장 응답 형식이 예상과 다릅니다");
};

/**
 * 노트 제목 변경
 * @param workspaceId 워크스페이스 ID
 * @param noteId 노트 ID
 * @param title 노트 제목
 * @returns 노트 제목 변경 결과
 */

export const patchNoteTitle = async (
  workspaceId: number,
  noteId: number,
  title: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await axiosInstance.patch(
    `${API_BASE}/${workspaceId}/notes/${noteId}/title`,
    { title }
  );

  console.log("📨 patchNoteTitle 응답:", data);

  if (data?.result) {
    return data.result;
  }
  if (data?.data) {
    return data.data;
  }

  throw new Error("노트 제목 변경 응답 형식이 예상과 다릅니다");
};

/**
 * 에러 처리 유틸리티
 */
export const handleNoteApiError = (error: unknown): string => {
  console.error("🔍 handleNoteApiError 호출:", error);

  if (error instanceof Error) {
    const axiosError = error as {
      response?: {
        status: number;
        data: { data?: { message?: string }; message?: string };
      };
      message?: string;
    };

    // 서버 응답 에러
    if (axiosError.response) {
      const { status, data } = axiosError.response;

      console.error("📡 서버 에러 응답:", { status, data });

      // 응답의 data.message 또는 data.data.message
      if (data?.data?.message) {
        return data.data.message;
      }
      if (data?.message) {
        return data.message;
      }

      // 상태 코드 기반 메시지
      switch (status) {
        case 400:
          return "잘못된 요청입니다. 입력값을 확인하세요.";
        case 401:
          return "인증이 필요합니다. 다시 로그인해주세요.";
        case 403:
          return "이 작업을 수행할 권한이 없습니다.";
        case 404:
          return "요청한 자원을 찾을 수 없습니다.";
        case 409:
          return "충돌이 발생했습니다. 다시 시도해주세요.";
        case 500:
          return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        default:
          return `서버 오류: ${status}`;
      }
    }

    // 네트워크 에러
    if (axiosError.message) {
      if (axiosError.message.includes("timeout")) {
        return "요청 시간이 초과되었습니다. 네트워크를 확인해주세요.";
      }
      if (axiosError.message.includes("Network")) {
        return "네트워크에 연결할 수 없습니다.";
      }
      return axiosError.message;
    }

    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};
