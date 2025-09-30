import { axiosInstance } from "../common/axiosInstance";

//휴지통 조회
export const GetTrashFolder = async (data: {
  workspaceId: number;
  sort?: string;
  cursor?: string;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/trash`,
      {
        params: {
          sort: data.sort,
          cursor: data.cursor,
          limit: data.limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("휴지통 조회 실패", error);
  }
};

//워크스페이스 루트 폴더 정보
export const GetRootFolder = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/root`
    );
    return response.data;
  } catch (error) {
    console.error("워크스페이스 루트 폴더 정보 조회 실패", error);
  }
};

//폴더 경로 조회
export const GetFolderPath = async (data: {
  workspaceId: number;
  folderId: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/folders/${data.folderId}/path`
    );
    return response.data;
  } catch (error) {
    console.error("폴더 경로 조회 실패", error);
  }
};

// 폴더/파일 목록 조회
export const GetFolderFileList = async (data: {
  workspaceId: number;
  folderId: number;
  sort?: string;
  cursor?: string;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/${data.workspaceId}/folders/${data.folderId}/items`,
      {
        params: {
          sort: data.sort,
          cursor: data.cursor,
          limit: data.limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("폴더/파일 목록 조회 실패", error);
  }
};
