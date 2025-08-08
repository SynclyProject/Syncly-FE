import React, { useState } from 'react';
import Button from '../shared/ui/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { SignUpSchema } from '../shared/schema';
import { sendEmail } from '../shared/apis/memberapi';


const SignupPage = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();
  //이메일 인증 & 코드 인증
  const [isVerified, setIsVerified] = useState(false);
  //닉네임 인증 필드 상태
  const [nickname, setNickname] = useState("");
  


    const handleVerifyClick = async (email: string) => {
      try {
        const response = await axios.post(
          'http://52.79.102.15:8080/api/member/email/send',
          null,
          {
            params: { email }
          }
        );
    
        if (response.data.isSuccess) {
          alert('인증 메일이 전송되었습니다!');
        } else {
          alert('전송 실패: ' + response.data.message);
        }
      } catch (error: any) {
        console.error(error);
        alert('서버 오류가 발생했습니다.');
      }
    };
    

  

  //useForm() react-hook-form 설정
  const {
    register,
    handleSubmit,
    trigger, 
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });


  const handleSendClick = async () => {


    const email = getValues("email");
       
    
    try{
      

      const response = await axios.post(
        'http://52.79.102.15:8080/api/member/email/send',
        null,
        {
          params: {email},
        }

      );

      if (response.data.isSuccess){
        setShowCodeInput(true);
        alert("인증메일이 전송되었습니다!")
      }

    }catch(error:any){  


      if(error.response?.data?.code === "MEMBER409_01"){
        alert("이미 가입된 이메일입니다.")
      }else { 
        alert("이메일 전송 중 오류가 발생했습니다.")
      }
    };



    
  };

  //Onsubmit함수
  const onSubmit = (data: any) => {
    console.log('제출된 데이터:', data);
    alert('회원가입이 완료되었습니다!');
    navigate('/login');

  };
  

  

  return (
    <div className="w-full min-h-screen bg-white flex justify-center overflow-auto">
      <div className="w-full max-w-md px-4 pt-10">
      
        <form onSubmit={handleSubmit(onSubmit)} className="w-[459px] flex flex-col gap-4 pt-24"> 
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
                <Button colorType="main" onClick={handleSendClick}>
                  Send
                </Button>

              </div>
              <div>
              {/*에러메세지*/}
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
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
                <Button type="button" colorType={isVerified ? 'success' : 'main'} onClick={handleVerifyClick}>Verify</Button>

              </div>
              <div>
              {/*에러메세지*/}
              {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}                
              </div>
            </>
          )}

          {/* Nickname */}
          {isVerified && (
            <div className="flex flex-col gap-2">
              <label className="text-[#585858] text-sm font-light mt-2">Nickname</label>
              <input
              {...register("nickname")}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Enter로 인한 submit 방지
                }
              }}
              className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm outline-none"
              />
              {errors.nickname && <p className="text-red-500 text-xs">{errors.nickname.message}</p>}
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
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

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
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}


          {/* Submit */}
          <button type= "submit" className="w-full h-[45px] bg-[#FDF5F2] rounded-[8px] border border-[#E0E0E0] text-[#EB5757] font-medium">
            Start with Syncly !
          </button>

          {/* Divider */}
          <div className="h-px bg-[#E6E6E6]" />

          {/* Google Sign-In */}
          <div className="flex items-center gap-4 border border-[#E6E6E6] px-4 py-2 rounded-[8px] bg-white cursor-pointer">
            <img src="/google-logo.png" className="w-6 h-6 " alt="Google" />
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

        {/*바닥 여유 공간용*/}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default SignupPage;

