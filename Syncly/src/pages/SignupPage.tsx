import { useState } from "react";
import Button from "../shared/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { SignUpSchema } from "../shared/schema";
import {
  PostEmailSend,
  PostEmailVerify,
  PostRegister,
} from "../shared/api/Member/post";
import { useMutation } from "@tanstack/react-query";
import { TSignUpSchema } from "../shared/type/sign";

const BeginGoogleLogin = ({ onModalClose }) => {
  const handleClose = () => {
    onModalClose(false);
  };
  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

const SignupPage = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();
  //이메일 인증 & 코드 인증
  const [isVerified, setIsVerified] = useState(false);

  const { mutate: postEmailSend } = useMutation({
    mutationFn: PostEmailSend,
    onSuccess: () => {
      alert("인증메일이 전송되었습니다!");
      setShowCodeInput(true);
    },
  });
  const { mutate: postEmailVerify } = useMutation({
    mutationFn: PostEmailVerify,
    onSuccess: () => {
      alert("인증되었습니다.");
      setIsVerified(true);
    },
  });

  const { mutate: postRegister } = useMutation({
    mutationFn: PostRegister,
    onSuccess: () => {
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    },
  });

  //useForm() react-hook-form 설정
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });

  const onSubmit = async (data: TSignUpSchema) => {
    await postRegister({
      email: data.email,
      password: data.password,
      name: data.nickname,
    });
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center overflow-auto">
      <div className="w-full max-w-md px-4 pt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[459px] flex flex-col gap-4 pt-24"
        >
          {/* Title */}
          <h1 className="text-center text-black text-6xl font-bold leading-[50px]">
            Sign up
          </h1>

          {/* Email */}
          <label className="text-[#585858] text-sm font-light">Email</label>
          <>
            <div className="flex gap-2">
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
              />

              <Button
                colorType="main"
                onClick={() => postEmailSend({ email: getValues("email") })}
              >
                Send
              </Button>
            </div>
            <div>
              {/*에러메세지*/}
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
          </>

          {/* Code Input */}
          {showCodeInput && (
            <>
              <div className="flex gap-2">
                <input
                  {...register("code")}
                  type="text"
                  placeholder="Code"
                  className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Enter로 인한 submit 방지
                    }
                  }}
                />
                <Button
                  type="button"
                  colorType={isVerified ? "success" : "main"}
                  onClick={() =>
                    postEmailVerify({
                      email: getValues("email"),
                      code: getValues("code"),
                    })
                  }
                >
                  Verify
                </Button>
              </div>
              <div>
                {/*에러메세지*/}
                {errors.code && (
                  <p className="text-red-500 text-xs">{errors.code.message}</p>
                )}
              </div>
            </>
          )}

          {/* Nickname */}
          {isVerified && (
            <div className="flex flex-col gap-2">
              <label className="text-[#585858] text-sm font-light mt-2">
                Nickname
              </label>
              <input
                {...register("nickname")}
                type="text"
                placeholder="Enter your nickname..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Enter로 인한 submit 방지
                  }
                }}
                className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
              />
              {errors.nickname && (
                <p className="text-red-500 text-xs">
                  {errors.nickname.message}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <label className="text-[#585858] text-sm font-light mt-2">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter your password..."
            className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Enter로 인한 submit 방지
              }
            }}
          />
          {/*에러메세지*/}
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          {/* Confirm Password */}
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm your password..."
            className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Enter로 인한 submit 방지
              }
            }}
          />
          {/*에러메세지*/}
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`w-full h-[45px] rounded-[8px]  font-medium cursor-pointer ${
              isValid
                ? "bg-[#028090] text-[#FFFFFF] border-none"
                : "bg-[#FDF5F2] border border-[#E0E0E0] text-[#EB5757]"
            }`}
            disabled={!isValid}
          >
            Start with Syncly !
          </button>
        </form>

        {/* Divider */}
        <div className="w-[459px] h-px bg-[#E6E6E6] mt-4 " />

        {/* Google Sign-In */}
        <button 
          onClick={BeginGoogleLogin}
          className="w-[459px] flex items-center justify-center gap-4 border border-[#E6E6E6] mt-4 px-4 py-2 rounded-[8px] bg-white cursor-pointer gap-2 text-black text-sm font-medium leading-6 font-['inter']">
          <img src="/google-logo.png" className="w-6 h-6" alt="Google" />{" "}
          <p>Continue with Google</p>
        </button>

        {/* Policy Text */}
        <p className="w-[459px] flex justify-center text-center text-[#585858] text-xs font-xl mt-4">
          By clicking “Continue with Google/Email” above, <br />
          you acknowledge that you have read and understood, and agree to
          Syncly’s Privacy Policy.
        </p>
        {/*바닥 여유 공간용*/}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default SignupPage;
