import { axiosInstance } from "../common/axiosInstance";

// 폴더 휴지통 이동
export const DeleteFolder = async (data: {
  workspaceId: number;
  folderId: number;
}) => {
  try {
    const response = await axiosInstance.delete(
      `/api/workspaces/${data.workspaceId}/folders/${data.folderId}`
    );
    return response.data;
  } catch (error) {
    console.error("폴더 휴지통 이동 실패", error);
  }
};

//폴더 이름 변경
export const PatchFolderName = async (data: {
  workspaceId: number;
  folderId: number;
  name: string;
}) => {
  console.log("data : ", data);
  try {
    const response = await axiosInstance.patch(
      `/api/workspaces/${data.workspaceId}/folders/${data.folderId}`,
      {
        name: data.name,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//폴더 완전 삭제
export const DeleteFolderPermanently = async (data: {
  workspaceId: number;
  folderId: number;
}) => {
  try {
    const response = await axiosInstance.delete(
      `/api/workspaces/${data.workspaceId}/folders/${data.folderId}/hard`
    );
    return response.data;
  } catch (error) {
    console.error("폴더 완전 삭제 실패", error);
  }
};
