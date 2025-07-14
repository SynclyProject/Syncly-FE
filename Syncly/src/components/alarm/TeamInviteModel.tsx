import React from "react";
import TeamMemberCard from "./TeamMemberCard"; 

interface TeamInviteModelProps {
  onClose: () => void;
}

const TeamInviteModel: React.FC<TeamInviteModelProps> = ({ onClose }) => {
  return (
    <div className="w-[703px] h-72 bg-white rounded-lg shadow-md border border-neutral-200 p-6 relative">
      {/* 이메일 입력 */}
      <input
        type="text"
        placeholder="이메일을 입력해주세요"
        className="w-full border-b border-neutral-300 mb-4 px-2 py-1 text-sm text-gray-500"
      />

      {/* 팀원 목록 */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-36">
        <TeamMemberCard name="김희재" role="팀스페이스 소유자" email="example@gmail.com" />
        <TeamMemberCard name="김희재" role="팀원" email="example@gmail.com" />
      </div>

      {/* 초대 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-4 bottom-4 px-4 py-2 bg-rose-400 text-white rounded-lg text-sm"
      >
        초대하기
      </button>
    </div>
  );
};

export default TeamInviteModel;
