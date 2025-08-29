import { axiosInstance } from "../common/axiosInstance";

// 모든 탭 및 URL 리스트 조회 (개인/팀 공용)
export const GetAllTaps = async (data: { workspaceId: number }) => {
  console.log("data : ", data);
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/tabs-with-urls`
    );
    return response.data;
  } catch (error) {
    console.error("모든 탭 및 URL 리스트 조회 실패", error);
    throw error;
  }
};
