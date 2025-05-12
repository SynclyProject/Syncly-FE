import React, { useState } from 'react';
import Button from '../shared/ui/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


const LoginPage = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  
  //send버튼 팝업 handleButtonClick()으로 send버튼, 팝업 한 번에
  const handleSendClick = () => {
    alert('인증메일이 전송되었습니다');
  };
  const handleButtonClick = () => {
    setShowCodeInput(true);
    handleSendClick();
  };

  //yup스키마 설정
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('이메일 형식이 올바르지 않습니다.')
      .required('이메일은 필수입니다.'),
  
    code: yup
      .string()
      .matches(/^\d{6}$/, '인증 코드는 6자리 숫자입니다.')
      .required('인증 코드를 입력해주세요.'),
  
    nickname: yup
      .string()
      .min(2, '최소 2자 이상')
      .max(12, '최대 12자')
      .required('닉네임을 입력해주세요.'),
  
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
        '8~20자, 영문,숫자,특수문자 포함.'
      )
      .required('비밀번호를 입력해주세요.'),
  
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
      .required('비밀번호 확인'),
  });

  //useForm() react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  //Onsubmit함수
  const onSubmit = (data: any) => {
    console.log('제출된 데이터:', data);
    alert('회원가입이 완료되었습니다!');
  };
  
  //코드인증 
  const [isVerified, setIsVerified] = useState(false);

  //인증성공시 setIsVerified(true) 호출
  const handleVerifyClick = () => {
    // 실제론 서버에 인증 코드 보내는 로직이 들어가야 함
    // 여기선 성공했다고 가정함
    setIsVerified(true);
    alert("이메일 인증 완료!");
  };
  

  return (
    <div className="w-full h-screen bg-white flex justify-center pt-0">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[459px] flex flex-col gap-4 pt-24"> 
        {/* Title */}
        <h1 className="text-center text-black text-6xl font-bold leading-[50px]">
          Sign up
        </h1>

        {/* Email */}
        <label className="text-[#585858] text-sm font-light">Email</label>
        <div className="flex gap-2">
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email address..."
            className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
          />
          <Button colorType="main" onClick={handleButtonClick}>
            Send
          </Button>

          {/*에러메세지*/}
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Code Input */}
        {showCodeInput && (
          <div className="flex gap-2">
            <input
              {...register("code")} 
              type="text"
              placeholder="Code"
              className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
            />
            <Button type= "button" colorType={isVerified ? 'success' : 'main'} onClick={handleVerifyClick}>Verify</Button>
          {/*에러메세지*/}
          {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
          </div>
        )}

        {/* Nickname */}
        <label className="text-[#585858] text-sm font-light mt-2">Nickname</label>
        <input
        {...register("nickname")}
        type="text"
        placeholder="Enter your nickname..."
        className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
        />
        {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname.message}</p>}


        {/* Password */}
        <label className="text-[#585858] text-sm font-light mt-2">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Enter your password..."
          className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
        />
        {/*에러메세지*/}
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

        {/* Confirm Password */}
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm your password..."
          className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
        />
        {/*에러메세지*/}
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}


        {/* Submit */}
        <button type= "submit" className="w-full h-[45px] bg-[#FDF5F2] rounded-[8px] border border-[#E0E0E0] text-[#EB5757] font-medium">
          Start with Syncly !
        </button>

        {/* Divider */}
        <div className="h-px bg-[#E6E6E6]" />

        {/* Google Sign-In */}
        <div className="flex items-center gap-4 border border-[#E6E6E6] px-4 py-2 rounded-[8px] bg-white cursor-pointer">
          <img src="https://placehold.co/24x24" className="w-6 h-6" alt="Google" />
          <span className="text-black text-sm font-medium leading-6 font-['inter']">
            Continue with Google
          </span>
        </div>

        {/* Policy Text */}
        <p className="text-center text-[#585858] text-xs font-extralight mt-2">
          By clicking “Continue with Google/Email” above, <br />
          you acknowledge that you have read and understood, and agree to
          Syncly’s Privacy Policy.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

