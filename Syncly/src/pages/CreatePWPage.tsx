import { useState } from "react";
import Button from "../shared/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { CreatePsSchema } from "../shared/schema";
import { TCreatePWSchema } from "../shared/type/sign";
import { useMutation } from "@tanstack/react-query";
import {
  PostPasswordEmailSend,
  PostEmailVerify,
} from "../shared/api/Member/post";
import { PatchPasswordEmail } from "../shared/api/Member/patch";

const CreatePWPage = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();

  //이메일 인증 & 코드 인증
  const [isVerified, setIsVerified] = useState(false);

  const { mutate: postEmailSend } = useMutation({
    mutationFn: PostPasswordEmailSend,
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
  const { mutate: PatchPasswordMutate } = useMutation({
    mutationFn: PatchPasswordEmail,
    onSuccess: () => {
      alert("비밀번호가 재설정되었습니다.");
      navigate("/login");
    },
  });

  const handleVerifyClick = async () => {
    const isValid = await trigger("code"); // 코드 필드 검증
    if (!isValid) return; // 유효하지 않으면 인증 안 함

    setIsVerified(true);
    alert("이메일 인증 완료!");
  };

  const handleSendClick = async () => {
    const isValid = await trigger("email"); // email 필드만 검증
    if (!isValid) return; // 유효하지 않으면 중단
    setShowCodeInput(true);
  };

  //useForm() react-hook-form 설정
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(CreatePsSchema),
  });

  //Onsubmit함수
  const onSubmit = (data: TCreatePWSchema) => {
    console.log("제출된 데이터:", data);
    PatchPasswordMutate({
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center overflow-auto">
      <div className="w-full max-w-md px-4 pt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[459px] flex flex-col gap-4 pt-15"
        >
          {/* Title */}
          <h1 className=" text-black text-5xl font-bold leading-[60px] whitespace-nowrap">
            Create new password
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

          {/* Password */}
          <label className="text-[#585858] text-sm font-light mt-2">
            Password
          </label>
          <input
            {...register("currentPassword")}
            type="password"
            placeholder="Enter your current password..."
            className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Enter로 인한 submit 방지
              }
            }}
          />
          {/*에러메세지*/}
          {errors.currentPassword && (
            <p className="text-red-500 text-xs">
              {errors.currentPassword.message}
            </p>
          )}

          {/* newPassword */}
          <label className="text-[#585858] text-sm font-light mt-2">
            New Password
          </label>
          <input
            {...register("newPassword")}
            type="password"
            placeholder="Enter your new password..."
            className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Enter로 인한 submit 방지
              }
            }}
          />
          {/*에러메세지*/}
          {errors.newPassword && (
            <p className="text-red-500 text-xs">{errors.newPassword.message}</p>
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
            className={`w-full h-[45px] rounded-[8px] font-medium ${
              isValid
                ? "bg-[#028090] text-[#FFFFFF] border-none"
                : "bg-[#FDF5F2] border border-[#E0E0E0] text-[#EB5757]"
            }`}
            disabled={!isValid}
          >
            Create new password
          </button>
        </form>

        {/* Divider */}
        <div className="w-[459px] h-px bg-[#E6E6E6] mt-4 " />
        {/* Google Sign-In */}

        <button className="w-[459px] flex items-center justify-center gap-4 border border-[#E6E6E6] mt-4 px-4 py-2 rounded-[8px] bg-white cursor-pointer gap-2 text-black text-sm font-medium leading-6 font-['inter']">
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

export default CreatePWPage;
