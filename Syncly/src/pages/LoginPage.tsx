import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { LoginSchema } from "../shared/schema";
import { TLoginSchema } from "../shared/type/sign";
import { useMutation } from "@tanstack/react-query";
import { PostLogin } from "../shared/api/Auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const { mutate: postLogin } = useMutation({
    mutationFn: PostLogin,
    onSuccess: (response) => {
      alert("로그인 성공!");
      localStorage.setItem("accessToken", response.result);
      navigate("/my-urls");
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
            className="w-full h-[45px] bg-[#FDF5F2] rounded-[8px] border border-[#E0E0E0] text-[#EB5757] font-medium"
          >
            Continue with password
          </button>
          <div className="flex flex-col gap-1 mb-1"></div>
        </form>

        {/* Forgot Password Link */}
        <button
          onClick={() => navigate("/createps")}
          className="text-red-500 text-sm mb-6 hover:underline text-left"
        >
          Did you forget your password?
        </button>

        {/* Divider */}
        <div className="h-px bg-[#E6E6E6]" />
        <div className="flex flex-col gap-1 mb-3"></div>

        {/* Google Sign-In */}
        <div className="flex items-center gap-4 border border-[#E6E6E6] px-4 py-2 rounded-[8px] bg-white cursor-pointer">
          <img src="/google-logo.png" className="w-6 h-6" alt="Google" />
          <span className="text-black text-sm font-medium leading-6 font-['inter']">
            Continue with Google
          </span>
        </div>
        <div className="flex flex-col gap-1 mb-4"></div>

        {/* Policy Text */}
        <p className="text-center text-[#585858] text-xs font-extralight mt-2">
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
