const Security = () => {
  const email = "syncly1234@gmail.com";
  return (
    <div className="w-full flex flex-col gap-[15px]">
      <p className="pb-4 text-[24px] font-semibold border-b border-b-[#E0E0E0]">
        계정 보안
      </p>
      <div className="max-w-[400px] flex flex-col justify-center gap-4">
        <p className="text-[20px] text-[#828282]">이메일</p>
        <input
          className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px]"
          type="text"
          value={email}
        />
      </div>
      <div className="max-w-[400px] flex flex-col justify-center gap-4">
        <p className="text-[20px] text-[#828282]">비밀번호</p>
        <input
          className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px]"
          type="text"
          placeholder="현재 비밀번호"
        />
        <input
          className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px]"
          type="text"
          placeholder="변경 비밀번호"
        />
        <input
          className="px-4 py-2 bg-[#F7F9FB] border border-[#E0E0E0] overflow-hidden text-[#828282] text-[16px] rounded-[6px]"
          type="text"
          placeholder="변경 비밀번호 재입력"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[20px] text-[#456990]">비밀번호 변경</p>
        <p className="text-[20px] text-[#EB5757]">계정 삭제</p>
      </div>
    </div>
  );
};

export default Security;
