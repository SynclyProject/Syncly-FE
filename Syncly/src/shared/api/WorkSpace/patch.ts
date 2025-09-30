import { axiosInstance } from "../common/axiosInstance";

// 팀 워크스페이크 이름 변경 (MANAGER만 변경 가능)
export const PatchSpaceName = async (data: {
  name: string;
  workspaceId: number;
}) => {
  console.log("data : ", data);
  try {
    const response = await axiosInstance.patch(
      `/api/workspaces/${data.workspaceId}/name`,
      {
        newName: data.name,
      }
    );
    return response.data;
  } catch (error) {
    console.error("팀 워크스페이크 이름 변경 실패", error);
  }
};
