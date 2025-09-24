import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import Button from "../../shared/ui/Button";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetSpaceMember } from "../../shared/api/WorkSpace/get";
import { TTeamMember } from "../../shared/type/teamSpaceType";
import { PostSpaceInvite } from "../../shared/api/WorkSpace/post";
import { AxiosError } from "axios";


interface TeamInviteModelProps {
  onClose: () => void;
  spaceId: number;
}

const TeamInviteModel: React.FC<TeamInviteModelProps> = ({
  onClose,
  spaceId,
}) => {
  const [email, setEmail] = useState("");

  const { data } = useQuery({
    queryKey: ["spaceMember", spaceId],
    queryFn: () => GetSpaceMember({ workspaceId: spaceId }),
  });

  const { mutate: postSpaceInviteMutation } = useMutation({
    mutationFn: PostSpaceInvite,
    onSuccess: () => {
      alert("이메일 초대가 완료되었습니다!");
      setEmail("");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error?.response?.data?.message);
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
      <div className="relative z-50 w-[703px] h-80 bg-white rounded-lg shadow-lg p-6 ">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>
        <div className="mt-6">
          {/* 이메일 입력 */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="이메일을 입력해주세요"
              className="w-full border-b border-neutral-300 mb-4 px-2 py-4 text-sm:10 text-gray-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* 추가 버튼 */}
            <Button
              colorType="main"
              iconName="add_circle"
              onClick={() => {
                postSpaceInviteMutation({ spaceId, email });
              }}
            />
            
          </div>

          {/* 팀원 목록 */}
          <p className="pb-4">팀원 목록</p>

          
          <div className="flex flex-col gap-1 overflow-y-auto pb-10">
            {data?.result.map((member: TTeamMember) => (
              <TeamMemberCard
                key={member.workspaceMemberId}
                name={member.memberName}
                role={member.role}
                email={member.memberEmail}
                spaceId={spaceId}
                memberId={member.workspaceMemberId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInviteModel;
