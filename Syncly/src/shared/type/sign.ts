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

type TDeleteSchema = {
  leaveReasonType:
    | "INCONVENIENT_SERVICE"
    | "MISSING_FEATURE"
    | "LOW_USAGE"
    | "UNSATISFACTORY_SUPPORT"
    | "ETC";
  leaveReason: string | null;
  password: string;
};

export type { TSignUpSchema, TLoginSchema, TCreatePWSchema, TDeleteSchema };
