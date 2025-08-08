type TSignUpSchema = {
  email: string;
  password: string;
  nickname: string;
};

type TLoginSchema = {
  email: string;
  password: string;
};

export type { TSignUpSchema, TLoginSchema };
