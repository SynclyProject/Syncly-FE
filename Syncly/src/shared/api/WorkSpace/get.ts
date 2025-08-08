import { axiosInstance2 } from "../common/axiosInstance";

// 팀 워크스페이스 리스트 전체 조회
export const GetSpaceList = async () => {
  try {
    const response = await axiosInstance2.get(`/api/workspaces`);
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 리스트 전체 조회 실패", error);
  }
};

// 해당 워크스페이스에서 자신의 ROLE 조회
export const GetSpaceRole = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosInstance2.get(
      `/api/workspaces/${data.workspaceId}/role`
    );
    return response.data;
  } catch (error) {
    console.error("해당 워크스페이스에서 자신의 ROLE 조회 실패", error);
  }
};

// 팀 워크스페이스 소속 멤버 조회
export const GetSpaceMember = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosInstance2.get(
      `/api/workspaces/${data.workspaceId}/members`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 소속 멤버 조회 실패", error);
  }
};

// 사용자의 초대 목록 조회
export const GetSpaceInvite = async () => {
  try {
    const response = await axiosInstance2.get(`/api/workspaces/invite`);
    return response.data;
  } catch (error) {
    console.error("사용자의 초대 목록 조회 실패", error);
    throw error;
  }
};

// 팀 워크스페이스 초대 수락 (이메일 링크 클릭)
export const GetSpaceAccept = async ({ data }: { data: { token: string } }) => {
  try {
    const response = await axiosInstance2.get(
      `/api/workspaces/accept/${data.token}`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 초대 수락(이메일 링크) 실패", error);
  }
};
