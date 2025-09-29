import { axiosInstance } from "../common/axiosInstance";

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
    return error;
  }
};

// 폴더 복원
export const PostFolderRestore = async (data: {
  workspaceId: number;
  folderId: number;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/${data.workspaceId}/folders/${data.folderId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("폴더 복원 실패", error);
  }
};
