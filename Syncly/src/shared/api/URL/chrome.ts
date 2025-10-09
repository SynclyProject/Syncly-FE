import { axiosInstance } from "../common/axiosInstance";

//크롬 익스텐션에서 현재 탭들을 저장하는 API
export const PostSaveTabs = async (tabs: string[]) => {
  try {
    const response = await axiosInstance.post("/api/workspaces/tabs/save", {
      urls: tabs,
    });
    return response.data;
  } catch (error) {
    console.error("크롬 익스텐션에서 현재 탭들을 저장하는 API 실패", error);
  }
};

//크롬 익스텐션에서 저장된 탭 조회 API
export const GetSavedTabs = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/workspaces/tabs/saved/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("크롬 익스텐션에서 저장된 탭 조회 API 실패", error);
  }
};
