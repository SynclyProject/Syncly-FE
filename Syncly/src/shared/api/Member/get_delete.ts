import { axiosInstance } from "../common/axiosInstance";

//프로필 이미지 삭제
export const DeleteProfileImage = async () => {
  try {
    const response = await axiosInstance.delete("/api/member/profile-image");
    return response.data;
  } catch (error) {
    console.error("프로필 이미지 삭제 실패", error);
    throw error;
  }
};

//회원 정보 조회
export const GetMemberInfo = async () => {
  try {
    const response = await axiosInstance.get("/api/member");
    return response.data;
  } catch (error) {
    console.error("회원 정보 조회 실패", error);
    throw error;
  }
};

/*
//회원 탈퇴
export const DeleteMember = async (data: {
  leaveReasonType: INCONVENIENT_SERVICE;
  leaveReason: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.delete("/api/member", {
      leaveReasonType: data.leaveReasonType,
      leaveReason: data.leaveReason,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    console.error("회원 탈퇴 실패", error);
    throw error;
  }
};
*/
