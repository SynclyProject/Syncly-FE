type TSignUpSchema = {
  email: string;
  password: string;
  nickname: string;
};

type TLoginSchema = {
  email: string;
  password: string;
};

type TCreatePWSchema = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
  code: string;
};
export type { TSignUpSchema, TLoginSchema, TCreatePWSchema };
