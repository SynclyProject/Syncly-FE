import React, { useState } from 'react';
import Button from '../shared/ui/Button';

const LoginPage = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);

  return (
    <div className="w-full h-screen bg-white flex justify-center pt-0">
      <div className="w-[459px] flex flex-col gap-4 pt-24">
        {/* Title */}
        <h1 className="text-center text-black text-6xl font-bold leading-[50px]">
          Sign up
        </h1>

        {/* Email */}
        <label className="text-[#585858] text-sm font-light">Email</label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email address..."
            className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
          />
          <Button colorType="main" onClick={() => setShowCodeInput(true)}>
            Send
          </Button>
        </div>

        {/* Code Input */}
        {showCodeInput && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Code"
              className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
            />
            <Button colorType="main">Verify</Button>
          </div>
        )}

        {/* Password */}
        <label className="text-[#585858] text-sm font-light mt-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password..."
          className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm your password..."
          className="px-4 py-2 border border-[#E0E0E0] rounded-[8px] bg-[#FDFDFD] text-sm"
        />

        {/* Submit */}
        <button className="w-full h-[45px] bg-[#FDF5F2] rounded-[8px] border border-[#E0E0E0] text-[#EB5757] font-medium">
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
      </div>
    </div>
  );
};

export default LoginPage;
