import { axiosInstance } from "./common/axiosInstance";

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

// 파일 업로드 Presigned Url 발급
export const PostFilePresignedUrl = async (data: {
  workspaceId: number;
  folderId: number;
  fileName: string;
  fileSize: number;
}) => {
  try {
    console.log(data);
    const response = await axiosInstance.post(
      `/api/workspaces/${data.workspaceId}/files/presigned-url`,
      {
        folderId: data.folderId,
        fileName: data.fileName,
        fileSize: data.fileSize,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//파일 업로드 완료 확인
export const PostFileUploadConfirm = async (data: {
  workspaceId: number;
  fileName: string;
  objectKey: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/${data.workspaceId}/files/confirm-upload`,
      {
        fileName: data.fileName,
        objectKey: data.objectKey,
      }
    );
    return response.data;
  } catch (error) {
    return error;
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
    return error;
  }
};

//파일 다운로드 URL 생성
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

//파일 완전 삭제
export const DeleteFilePermanently = async (data: {
  workspaceId: number;
  fileId: number;
}) => {
  try {
    const response = await axiosInstance.delete(
      `/api/workspaces/${data.workspaceId}/files/${data.fileId}/hard`
    );
    return response.data;
  } catch (error) {
    console.error("파일 완전 삭제 실패", error);
  }
};
