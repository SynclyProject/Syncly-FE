import { axiosInstance } from "./common/axiosInstance";

// 폴더 생성
export const PostFolder = async (data: {
  workspaceId: number;
  parentId: number | null;
  name: string;
}) => {
  console.log(data);
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/${data.workspaceId}/folders`,
      {
        parentId: data.parentId,
        name: data.name,
      }
    );
    return response.data;
  } catch (error) {
    console.error("폴더 생성 실패", error);
    throw error;
  }
};
