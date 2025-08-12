import TeamInviteModel from "../../../components/alarm/TeamInviteModel";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceRole } from "../../../shared/api/WorkSpace/get";
import { useParams } from "react-router-dom";

interface ISideModalProps {
  editTeam: boolean;
  setEditTeam: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideModal = ({ editTeam, setEditTeam }: ISideModalProps) => {
  const [showInviteModel, setShowInviteModel] = useState(false);

  const { spaceId } = useParams();
  const workspaceId = Number(spaceId);

  const { data: roleData } = useQuery({
    queryKey: ["role"],
    queryFn: () => GetSpaceRole({ workspaceId: workspaceId }),
  });
  console.log("roleData", roleData);

  return (
    <div className="flex flex-col gap-5 w-[210px] rounded-[8px] bg-white p-4 border border-[#E0E0E0]">
      <p className="text-[##828282]" onClick={() => setShowInviteModel(true)}>
        팀원 관리
      </p>

      {showInviteModel && (
        <>
          <div
            //className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowInviteModel(false)}
          />
          <TeamInviteModel onClose={() => setShowInviteModel(false)} />
        </>
      )}

      <p
        className="text-[##828282]"
        onClick={() => {
          setEditTeam(!editTeam);
        }}
      >
        팀스페이스 이름 변경
      </p>
      <p
        className="text-[#F45B69]"
        onClick={() => {
          //팀스페이스 나가기 api 추가
        }}
      >
        팀스페이스 나가기
      </p>
    </div>
  );
};
export default SideModal;
