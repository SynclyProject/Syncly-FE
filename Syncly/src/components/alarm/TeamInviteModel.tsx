import React from "react";
import TeamMemberCard from "./TeamMemberCard"; 
import Button from "../../shared/ui/Button";
import { useState } from "react";


interface TeamInviteModelProps {
  onClose: () => void;
}

const TeamInviteModel: React.FC<TeamInviteModelProps> = ({ onClose }) => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
    <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
    {/* <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      /> */}
    <div className="relative z-50 w-[703px] h-80 bg-white rounded-lg shadow-lg p-6">

    {/* 닫기 버튼 */}
    <button
                
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
    >
    &times;
    </button> 

    {/* 이메일 입력 */}
    <div className="flex items-center gap-2 mb-4">
    <input
            type="text"
            placeholder="이메일을 입력해주세요"
            className="w-full border-b border-neutral-300 mb-4 px-2 py-4 text-sm text-gray-500"
      />
      {/* 추가 버튼 */}
      <Button
          
          colorType="main"
          iconName="add_circle"
          onClick={() => setShowInput(true)}
        />
      </div>



      {/* 팀원 목록 */}
      <p className = "pb-4">팀원 목록</p>
      <div className="flex flex-col gap-1 overflow-y-auto pb-10">
        <TeamMemberCard name="김희재" role="팀스페이스 소유자" email="example@gmail.com" />
        <TeamMemberCard name="김희재" role="팀원" email="example@gmail.com" />
      </div>

      {/* 초대 버튼
      <button
        onClick={onClose}
        className="absolute right-4 bottom-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
      >
        초대하기
      </button> */}
    </div>
    </div>
  );
};

export default TeamInviteModel;
