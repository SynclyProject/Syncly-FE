import { TTeamSpace } from "../../type/teamSpaceType";
import TeamInviteModel from "../../../components/alarm/TeamInviteModel";
import { useState } from "react";

interface ISideModalProps {
  spaceId: number;
  setTeams: React.Dispatch<React.SetStateAction<TTeamSpace[]>>;
  editTeam: boolean;
  setEditTeam: React.Dispatch<React.SetStateAction<boolean>>;
}



const SideModal = ({
  spaceId,
  setTeams,
  editTeam,
  setEditTeam,
}: ISideModalProps) => {
  const [showInviteModel, setShowInviteModel] = useState(false);
  return (
    <div className="flex flex-col gap-5 w-[210px] rounded-[8px] bg-white p-4 border border-[#E0E0E0]">
      <p className="text-[##828282]"
      onClick = {()=> 
        setShowInviteModel(true)}>팀원 추가</p>
      {showInviteModel && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
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
          setTeams((prev) => prev.filter((team) => team.id !== spaceId));
        }}
      >
        팀스페이스 나가기
      </p>
    </div>
  );
};
export default SideModal;
