import { axiosInstance } from "../common/axiosInstance";

//프로필 이미지 수정
export const PatchProfileImage = async (data: {
  fileName: string;
  objectKey: string;
}) => {
  try {
    const response = await axiosInstance.patch("/api/member/profile-image", {
      fileName: data.fileName,
      objectKey: data.objectKey,
    });
    return response.data;
  } catch (error) {
    console.error("프로필 이미지 수정 실패", error);
    throw error;
  }
};

// 비밀번호 변경
export const PatchPassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axiosInstance.patch("/api/member/password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("비밀번호 변경 실패", error);
    throw error;
  }
};

// 닉네임 변경
export const PatchNickname = async (data: { newName: string }) => {
  try {
    const response = await axiosInstance.patch("/api/member/name", {
      newName: data.newName,
    });
    return response.data;
  } catch (error) {
    console.error("닉네임 변경 실패", error);
    throw error;
  }
};
