import { axiosInstance } from "./common/axiosInstance";

// 파일 업로드
export const PostFile = async (data: {
  workspaceId: number;
  folderId: number;
  file: File;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/${data.workspaceId}/files`,
      data.file,
      {
        params: { folderId: data.folderId },
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("파일 업로드 실패", error);
  }
};

//파일 복원
export const PostFileRestore = async (data: {
  workspaceId: number;
  fileId: number;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/${data.workspaceId}/files/${data.fileId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("파일 복원 실패", error);
  }
};

//파일 휴지통 이동
export const DeleteFile = async (data: {
  workspaceId: number;
  fileId: number;
}) => {
  try {
    const response = await axiosInstance.delete(
      `/api/workspaces/${data.workspaceId}/files/${data.fileId}`
    );
    return response.data;
  } catch (error) {
    console.error("파일 휴지통 이동 실패", error);
  }
};

//파일 이름 변경
export const PatchFileName = async (data: {
  workspaceId: number;
  fileId: number;
  name: string;
}) => {
  try {
    const response = await axiosInstance.patch(
      `/api/workspaces/${data.workspaceId}/files/${data.fileId}`,
      {
        name: data.name,
      }
    );
    return response.data;
  } catch (error) {
    console.error("파일 이름 변경 실패", error);
  }
};

//파일 다운로드
export const GetFileDownload = async (data: {
  workspaceId: number;
  fileId: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/files/${data.fileId}/download`
    );
    return response.data;
  } catch (error) {
    console.error("파일 다운로드 실패", error);
  }
};
