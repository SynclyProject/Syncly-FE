import { axiosInstance } from "./common/axiosInstance";

export const PostViewCookie = async (data: { objectKey: string }) => {
  try {
    const response = await axiosInstance.post(`/api/s3/view-cookie`, {
      objectKey: data.objectKey,
    });
    return response.data;
  } catch (error) {
    console.error("??? 실패", error);
  }
};

export const PostProfile = async (file: File) => {
  try {
    const response = await axiosInstance.post("/api/s3/presigned-url/profile", {
      fileName: file.name,
      mimeType: file.type,
    });
    return response.data;
  } catch (error) {
    console.error("프로필 업로드 실패", error);
  }
};

export const PostDrive = async (data: {
  folderId: number;
  memberId: number;
  fileName: string;
  mimeType: File;
}) => {
  try {
    const response = await axiosInstance.post("/api/s3/presigned-url/drive", {
      folderId: data.folderId,
      memberId: data.memberId,
      fileName: data.fileName,
      mimeType: data.mimeType,
    });
    return response.data;
  } catch (error) {
    console.error("드라이브 업로드 실패", error);
  }
};

export const PostDownLoadUrl = async (data: {
  objectKey: string;
  fileName: string;
  fileId: number;
}) => {
  try {
    const response = await axiosInstance.post("/api/s3/download-url", {
      objectKey: data.objectKey,
      fileName: data.fileName,
      fileId: data.fileId,
    });
    return response.data;
  } catch (error) {
    console.error("다운로드 URL 생성 실패", error);
  }
};
