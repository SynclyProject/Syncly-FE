import { axiosInstance } from "./common/axiosInstance";

//최신 채팅 메세지 조회 (seq ASC 정렬)
export const GetChatList = async (data: {
  workspaceId: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/messages`,
      {
        params: {
          limit: data.limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("채팅 목록 조회 실패", error);
  }
};

//과거 메세지 더 보기 (무한스크롤, ASC 정렬)
export const GetChatLisBefore = async (data: {
  workspaceId: number;
  limit?: number;
  beforeSeq: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/messages/before`,
      {
        params: {
          limit: data.limit,
          beforeSeq: data.beforeSeq,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("과거 메세지 더 보기 실패", error);
  }
};

//끊김 보정 (afterSeq 이후의 메세지 조회, ASC 정렬)
export const GetChatLisAfter = async (data: {
  workspaceId: number;
  limit?: number;
  afterSeq: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/messages/after`,
      {
        params: {
          limit: data.limit,
          afterSeq: data.afterSeq,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("끊김 보정 실패", error);
  }
};

export const GetWorkspaceMemberId = async (workspaceId: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${workspaceId}/me`
    );
    return response.data;
  } catch (error) {
    console.error("워크스페이스 멤버 아이디 조회 실패", error);
  }
};
