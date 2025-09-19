import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginSchema } from "../shared/schema";
import { TLoginSchema } from "../shared/type/sign";
import { useMutation } from "@tanstack/react-query";
import { PostLogin } from "../shared/api/Auth";
import { useAuthContext } from "../context/AuthContext";
import { AxiosError } from "axios";
import { Social } from "../shared/api/Social";
import { PostPersonalSpace } from "../shared/api/WorkSpace/post";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkLoginStatus } = useAuthContext();

  // redirectTo state 확인
  const redirectTo = location.state?.redirectTo;
  const message = location.state?.message;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const { mutate: postLogin } = useMutation({
    mutationFn: PostLogin,
    onSuccess: (response) => {
      alert("로그인 성공!");
      localStorage.setItem("accessToken", response.result);
      checkLoginStatus(); // AuthContext 상태 업데이트
      PostPersonalSpace();

      // redirectTo가 있으면 해당 경로로, 없으면 기본 경로로 이동
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/my-urls");
      }
      window.location.reload();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error?.response?.data?.message);
    },
  });

  const onSubmit = async (data: TLoginSchema) => {
    await postLogin(data);
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center overflow-auto">
      <div className="w-full max-w-md px-4 pt-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[459px] flex flex-col gap-0.5"
        >
          {/* Title */}
          <h1 className="text-center text-black text-6xl font-bold leading-[50px]">
            Sign in
          </h1>

          {/* 메시지 표시 */}
          {message && (
            <div className="text-center text-blue-600 text-sm mt-5 p-3">
              {message}
            </div>
          )}

          {/* Email */}
          <label className="text-[#585858] text-sm font-light mt-6 block">
            Email
          </label>
          <div className="flex flex-col gap-1 mb-4">
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email address..."
              className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <label className="text-[#585858] text-sm font-light mt-2 block">
            Password
          </label>
          <div className="flex flex-col gap-1 mb-6">
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password..."
              className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

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
            Continue with password
          </button>
          <div className="flex flex-col gap-1 mb-1"></div>
        </form>

        {/* Forgot Password Link */}
        <button
          onClick={() => navigate("/create-pw")}
          className="text-red-500 text-sm mb-3 hover:underline text-left cursor-pointer"
        >
          Did you forget your password?
        </button>

        {/* Divider */}
        <div className="w-[459px] h-px bg-[#E6E6E6] mt-2 " />
        {/* Google Sign-In */}

        <button 
          onClick={() => Social()}
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

export default LoginPage;
