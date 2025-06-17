//import TeamSpaceData from "../../api/mock/teamSpace";
import Space from "./Space";
import { useNavigate } from "react-router-dom";
import { TTeamSpace } from "../../type/teamSpaceType";
import InputSpace from "./InputSpace";
import { useState } from "react";

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

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">TEAM SPACES</p>
      {teams.map((space: TTeamSpace) => (
        <Space
          key={space.id}
          state="team"
          iconName="attachment"
          text={space.text}
          onClick={() => navigate(`/team-urls/${space.id}`)}
          setTeams={setTeams}
          spaceId={space.id}
        />
      ))}
      {(teams.length === 0 || showInput) && (
        <InputSpace
          onAdd={handleAddTeam}
          onCancel={() => setShowInput(false)}
        />
      )}
    </div>
  );
};
export default TeamSpace;
