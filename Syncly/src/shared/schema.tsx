import * as yup from "yup";

//회원가입 스키마
export const SignUpSchema = yup.object().shape({
  email: yup
    .string()
    .email("이메일 형식이 올바르지 않습니다.")
    .required("이메일은 필수입니다."),

  code: yup
    .string()
    .matches(/^[a-zA-Z0-9]{6}$/, "인증 코드는 6자리 영어,숫자입니다.")
    .required("인증 코드를 입력해주세요."),

  nickname: yup
    .string()
    .min(2)
    .max(12)
    .required("닉네임을 적어주세요. (최소 2자, 최대 12자)"),

  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
      "영문,숫자,특수문자 포함 8-20자"
    )
    .required("비밀번호를 입력해주세요."),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인"),
});

// 로그인 스키마
export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("이메일 형식이 올바르지 않습니다.")
    .required("이메일은 필수입니다."),
  password: yup.string().required("비밀번호를 입력해주세요."),
});

// 비밀번호 재설정 스키마
export const CreatePsSchema = yup.object().shape({
  email: yup
    .string()
    .email("이메일 형식이 올바르지 않습니다.")
    .required("이메일은 필수입니다."),
  code: yup
    .string()
    .matches(/^\d{6}$/, "인증 코드는 6자리 숫자입니다.")
    .required("인증 코드를 입력해주세요."),
  currentPassword: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
      "영문,숫자,특수문자 포함 8-20자"
    )
    .required("비밀번호를 입력해주세요."),
  newPassword: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
      "영문,숫자,특수문자 포함 8-20자"
    )
    .required("비밀번호를 입력해주세요."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인"),
});
