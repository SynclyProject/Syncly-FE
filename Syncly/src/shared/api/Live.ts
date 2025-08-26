import { axiosInstance } from "./common/axiosInstance";

export const PostWebhook = async () => {
  try {
    const response = await axiosInstance.post("/api/livekit/webhook");
    console.log("웹훅 연결 성공", response.data);
  } catch (error) {
    console.error("웹훅 연결 실패", error);
  }
};

export const GetLiveToken = async (workspaceId: number) => {
  try {
    const response = await axiosInstance.get("/api/livekit/token", {
      params: {
        workspaceId: workspaceId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    console.error("토큰 발급 실패", error);
  }
};

export const GetInitInfo = async (data: { workspaceId: number }) => {
  try {
    const response = await axiosInstance.get("/api/livekit/init", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("라이브킷 정보 조회 실패", error);
  }
};

export const DeleteLiveRoom = async (roomId: number) => {
  try {
    await axiosInstance.delete(
      "/api/livekit/twirp/livekit.RoomService/DeleteRoom",
      {
        params: {
          roomId: roomId,
        },
      }
    );
    console.log("라이브킷 방 삭제 성공");
  } catch (error) {
    console.error("라이브킷 방 삭제 실패", error);
  }
};
