import { axiosInstance } from "../common/axiosInstance";

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

// 팀 워크스페이스 생성 API
export const PostTeamSpace = async (data: { name: string }) => {
  try {
    const response = await axiosInstance.post("/api/workspaces/team", {
      workspaceName: data.name,
    });
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 생성 실패", error);
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

// 워크스페이스 초대 수락 API(알림창)
export const PostSpaceAccept = async (data: { spaceId: number }) => {
  try {
    const response = await axiosInstance.post(`/api/workspaces/accept`, {
      invitationId: data.spaceId,
    });
    return response.data;
  } catch (error) {
    console.error("워크스페이스 초대 수락(알림창) 실패", error);
    throw error;
  }
};
