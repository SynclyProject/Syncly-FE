import { axiosInstance, axiosBasic } from "./common/axiosInstance";

//회원가입
export const PostRegister = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axiosInstance.post("/api/member/register", data);
    return response.data;
  } catch (error) {
    console.error("회원가입 실패", error);
    throw error;
  }
};

//이메일 인증
export const PostEmailVerify = async (data: {
  email: string;
  code: string;
}) => {
  try {
    const response = await axiosBasic.post("/api/member/email/verify", {
      email: data.email,
      code: data.code,
    });
    return response.data;
  } catch (error) {
    console.error("이메일 인증 실패", error);
    throw error;
  }
};

//이메일 인증코드 전송
export const PostEmailSend = async (data: { email: string }) => {
  try {
    const response = await axiosBasic.post("/api/member/email/send", {
      email: data.email,
    });
    return response.data;
  } catch (error) {
    console.error("이메일 인증코드 전송 실패", error);
    throw error;
  }
};

//프로필 이미지 삭제
export const DeleteProfileImage = async () => {
  try {
    const response = await axiosBasic.delete("/api/member/profile-image");
    return response.data;
  } catch (error) {
    console.error("프로필 이미지 삭제 실패", error);
    throw error;
  }
};

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

//회원 정보 조회
export const GetMemberInfo = async () => {
  try {
    const response = await axiosBasic.get("/api/member");
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
