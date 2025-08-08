//import TeamSpaceData from "../../api/mock/teamSpace";
import Space from "./Space";
import { useNavigate } from "react-router-dom";
import { TTeamSpace } from "../../type/teamSpaceType";
import InputSpace from "./InputSpace";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceList } from "../../api/WorkSpace";

interface TeamSpaceProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const TeamSpace = ({ showInput, setShowInput }: TeamSpaceProps) => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TTeamSpace[]>([]);
  const handleAddTeam = (text: string) => {
    if (!text.trim()) return;
    const newTeam: TTeamSpace = {
      id: teams.length + 1,
      text,
      isEdit: false,
    };
    setTeams((prev) => [...prev, newTeam]);
    setShowInput(false);
  };

  const { data: spaceList, isPending } = useQuery({
    queryFn: GetSpaceList,
    queryKey: ["spaceList"],
  });

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">TEAM SPACES</p>
      {spaceList?.result?.map((space: TTeamSpace) => (
        <Space
          key={space.workspaceId}
          state="team"
          iconName="attachment"
          text={space.workspaceName}
          onClick={() => navigate(`/team-urls/${space.workspaceId}`)}
          setTeams={setTeams}
          spaceId={space.workspaceId}
        />
      ))}
      {(spaceList?.result?.length === 0 || showInput) && (
        <InputSpace
          onAdd={handleAddTeam}
          onCancel={() => setShowInput(false)}
        />
      )}
    </div>
  );
};
export default TeamSpace;
