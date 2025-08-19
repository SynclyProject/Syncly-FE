import { axiosInstance2 } from "../common/axiosInstance";

// 팀 워크스페이스 삭제 (MANAGER만 가능)
export const DeleteSpace = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosInstance2.delete(
      `/api/workspaces/${data.workspaceId}`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 삭제 실패", error);
  }
};

// 팀 워크스페이스 멤버 추방하기 (MANAGER만 가능)
export const DeleteSpaceKick = async (data: {
  workspaceId: number;
  targetMemberId: number;
}) => {
  try {
    const response = await axiosInstance2.delete(
      `/api/workspaces/${data.workspaceId}/members/${data.targetMemberId}/kick`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 추방하기 실패", error);
  }
};

// 팀 워크스페이스 나가기 (MEMBER가 나가면 위임)
export const DeleteSpaceLeave = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosInstance2.delete(
      `/api/workspaces/${data.workspaceId}/leave`
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이스 나가기 실패", error);
  }
};
