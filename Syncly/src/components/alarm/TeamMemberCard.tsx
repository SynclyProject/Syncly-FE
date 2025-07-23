import React, { useState } from "react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  email: string;
  showMenu?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  email,
  showMenu = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full flex items-center border-t border-zinc-200 bg-white px-4 py-2">
      {/* 프로필 + 이름/역할 */}
      <div className="flex w-1/2 items-center gap-2">
        {/* 프로필 이미지 */}
        <div className="w-10 h-10 bg-slate-100 rounded-full flex justify-center items-center">
          <div className="w-6 h-6 relative overflow-hidden">
            <div className="w-3.5 h-5 left-[5px] top-[2px] absolute bg-neutral-300" />
          </div>
        </div>
  
        {/* 이름 + 역할 */}
        <div className="flex flex-col justify-center">
          <div className="text-zinc-800 text-sm font-medium font-['Roboto'] leading-none">
            {name}
          </div>
          <div className="text-zinc-500 text-xs font-normal font-['Inter'] leading-none">
            {role}
          </div>
        </div>
      </div>
  
      {/* 이메일 */}
      <div className="w-1/3 flex items-center">
        <div className="text-slate-500 text-sm font-normal font-['Roboto'] leading-tight">
          {email}
        </div>
      </div>
  
      {/* 메뉴 버튼 */}
      {showMenu && (
        <div className="w-10 flex items-center justify-end">
          <div
            className="flex flex-col items-center gap-[3px] cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="w-1 h-1 rounded-full bg-zinc-500" />
            <div className="w-1 h-1 rounded-full bg-zinc-500" />
            <div className="w-1 h-1 rounded-full bg-zinc-500" />
          </div>
        </div>
      )}

  

        {/* 모달 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-64">
              <p className="text-lg font-semibold mb-4">정말 추방하시겠어요?</p>
              <button
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-500 transition"
                onClick={() => {
                  alert("추방되었습니다!");
                  setShowModal(false);
                }}
              >
                추방하기
              </button>
              <button
                className="w-full mt-2 text-sm text-gray-500 underline"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        )}
      
  
    </div>
  
  );
};

export default TeamMemberCard;
