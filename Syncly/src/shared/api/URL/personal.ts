import { axiosInstance } from "../common/axiosInstance";

//URL 탭 생성
export const PostTaps = async (data: { urlTabName: string }) => {
  try {
    const response = await axiosInstance.post("/api/workspaces/tabs", {
      urlTabName: data.urlTabName,
    });
    return response.data;
  } catch (error) {
    console.error("탭 생성 실패", error);
  }
};

//URL 아이템 생성
export const PostTabItems = async (data: { tabId: number; url: string }) => {
  console.log("URL 아이템 생성 data", data);
  try {
    const response = await axiosInstance.post(
      `/api/workspaces/tabs/${data.tabId}`,
      {
        url: data.url,
      }
    );
    return response.data;
  } catch (error) {
    console.error("URL 아이템 생성 실패", error);
  }
};

// URL 탭 삭제
export const DeleteTaps = async (data: { tabId: number }) => {
  try {
    const response = await axiosInstance.delete(
      `/api/workspaces/tabs/${data.tabId}`
    );
    return response.data;
  } catch (error) {
    console.error("URL 탭 삭제 실패", error);
  }
};

// URL 아이템 삭제
export const DeleteTabItems = async (data: {
  tabId: number;
  itemId: number;
}) => {
  try {
    const response = await axiosInstance.delete(
      `/api/workspaces/tabs/${data.tabId}/${data.itemId}`
    );
    return response.data;
  } catch (error) {
    console.error("URL 아이템 삭제 실패", error);
  }
};

// URL 탭 이름 변경
export const PatchTaps = async (data: {
  tabId: number;
  urlTabName: string;
}) => {
  try {
    const response = await axiosInstance.patch(
      `/api/workspaces/tabs/${data.tabId}`,
      {
        newUrlTabName: data.urlTabName,
      }
    );
    return response.data;
  } catch (error) {
    console.error("URL 탭 이름 변경 실패", error);
  }
};
