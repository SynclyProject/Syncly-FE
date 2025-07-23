import { axiosInstance, axiosBasic } from "./common/axiosInstance";

// 워크스페이스 초대 API
export const PostSpaceInvite = async (data: {
  spaceId: number;
  email: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/${data.spaceId}/invite`,
      {
        email: data.email,
      }
    );
    return response.data;
  } catch (error) {
    console.error("워크스페이스 초대 실패", error);
    throw error;
  }
};

// 개인 워크스페이스 생성 API
export const PostPersonalSpace = async () => {
  try {
    const response = await axiosInstance.post(`/api/workspaces/personal`);
    return response.data;
  } catch (error) {
    console.error("개인 워크스페이스 생성 실패", error);
    throw error;
  }
};

// 팀 워크스페이스 생성 API
export const PostTeamSpace = async (data: { name: string }) => {
  try {
    const response = await axiosInstance.post(
      "/api/workspaces/team",
      data.name
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 생성 실패", error);
    throw error;
  }
};

// 워크스페이스 초대 수락 API(알림창)
export const PostSpaceAccept = async (data: { spaceId: number }) => {
  try {
    const response = await axiosInstance.post(`/api/workspaces/reject`, {
      invitationId: data.spaceId,
    });
    return response.data;
  } catch (error) {
    console.error("워크스페이스 초대 수락(알림창창) 실패", error);
    throw error;
  }
};

// 워크스페이스 초대 거절 API(알림창)
export const PostSpaceReject = async ({
  data,
}: {
  data: { spaceId: number };
}) => {
  try {
    const response = await axiosInstance.post(`/api/workspaces/reject`, {
      invitationId: data.spaceId,
    });
    return response.data;
  } catch (error) {
    console.error("워크스페이스 초대 거절(알림창) 실패", error);
    throw error;
  }
};

// 워크스페이스 초대 수락 API (이메일 링크 클릭)
export const GetSpaceAccept = async ({ data }: { data: { token: number } }) => {
  try {
    const response = await axiosBasic.get(
      `/api/workspaces/accept/${data.token}`
    );
    return response.data;
  } catch (error) {
    console.error("워크스페이스 초대 수락(이메일 링크) 실패", error);
    throw error;
  }
};

// 사용자의 초대 목록 조회
export const GetSpaceInvite = async () => {
  try {
    const response = await axiosBasic.get(`/api/workspaces/invite`);
    return response.data;
  } catch (error) {
    console.error("사용자의 초대 목록 조회 실패", error);
    throw error;
  }
};

// 팀 워크스페이크 이름 변경 (MANAGER만 변경 가능)
export const PatchSpaceName = async (data: {
  name: string;
  workspaceId: number;
}) => {
  try {
    const response = await axiosBasic.patch(`/api/${data.workspaceId}/name`, {
      name: data.name,
    });
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이크 이름 변경 실패", error);
  }
};

// 팀 워크스페이스 나가기
export const DeleteSpaceLeave = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosBasic.delete(
      `/api/workspaces/${data.workspaceId}/leave`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 나가기 실패", error);
  }
};

// 팀 워크스페이스 추방하기 (MANAGER만 가능)
export const DeleteSpaceKick = async (data: {
  workspaceId: number;
  memberId: number;
}) => {
  try {
    const response = await axiosBasic.delete(
      `/api/workspaces/${data.workspaceId}/members/${data.memberId}/kick`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 추방하기 실패", error);
  }
};

// 팀 워크스페이스 리스트 전체 조회
export const GetSpaceList = async () => {
  try {
    const response = await axiosBasic.get(`/api/workspaces`);
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 리스트 전체 조회 실패", error);
  }
};

// 팀 워크스페이스 소속 멤버 조회
export const GetSpaceMember = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosBasic.get(
      `/api/workspaces/${data.workspaceId}/members`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 소속 멤버 조회 실패", error);
  }
};

// 팀 워크스페이스 삭제 (MANAGER만 가능)
export const DeleteSpace = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosBasic.delete(
      `/api/workspaces/${data.workspaceId}/members`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 삭제 실패", error);
  }
};

// 해당 워크스페이스에서 자신의 ROLE 조회
export const GetSpaceRole = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosBasic.get(
      `/api/workspaces/${data.workspaceId}/role`
    );
    return response.data;
  } catch (error) {
    console.error("해당 워크스페이스에서 자신의 ROLE 조회 실패", error);
  }
};
