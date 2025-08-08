import { axiosInstance2 } from "../common/axiosInstance";

// 팀 워크스페이크 이름 변경 (MANAGER만 변경 가능)
export const PatchSpaceName = async (data: {
  name: string;
  workspaceId: number;
}) => {
  try {
    const response = await axiosInstance2.patch(
      `/api/${data.workspaceId}/name`,
      {
        newName: data.name,
      }
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이크 이름 변경 실패", error);
  }
};
