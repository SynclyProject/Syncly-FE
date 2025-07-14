import React from "react";

interface TeamMemberCardProps {
  name: string;
  role: string; 
  email: string;
  showMenu?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, email, showMenu = true }) => {
  return (
    <div className="self-stretch bg-white/0 inline-flex justify-start items-end overflow-hidden">
      {/* 프로필 + 이름/역할 */}
      <div className="self-stretch border-t border-zinc-200 inline-flex flex-col justify-center items-start">
        <div className="self-stretch px-3 py-2 inline-flex justify-start items-center overflow-hidden">
          <div className="w-96 self-stretch flex justify-start items-center gap-2">
            {/* 프로필 이미지 or 아이콘 */}
            <div className="w-10 h-10 bg-slate-100 rounded-full flex justify-center items-center">
              <div className="w-6 h-6 relative overflow-hidden">
                <div className="w-3.5 h-5 left-[5px] top-[2px] absolute bg-neutral-300" />
              </div>
            </div>

            {/* 이름, 역할 */}
            <div className="flex-1 flex flex-col justify-start items-start">
              <div className="text-zinc-800 text-sm font-medium font-['Roboto'] leading-none">
                {name}
              </div>
              <div className="text-zinc-500 text-xs font-normal font-['Inter'] leading-none">
                {role}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이메일 */}
      <div className="w-40 self-stretch border-t border-zinc-200 flex flex-col justify-center items-start">
        <div className="self-stretch p-3 flex flex-col justify-center items-start">
          <div className="text-slate-500 text-sm font-normal font-['Roboto'] leading-tight">
            {email}
          </div>
        </div>
      </div>

      {/* 메뉴 버튼 (옵션 버튼) */}
      {showMenu && (
        <div className="w-10 self-stretch border-t border-zinc-200 flex flex-col justify-center items-end">
          <div className="px-3 py-4 flex justify-center items-center">
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-3.5 h-1 left-[1.33px] top-[6px] absolute bg-zinc-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
