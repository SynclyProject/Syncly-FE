//import TeamSpaceData from "../../api/mock/teamSpace";
import Space from "./Space";
import { useNavigate, useLocation } from "react-router-dom";
import { TTeamSpace } from "../../type/teamSpaceType";
import InputSpace from "./InputSpace";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceList } from "../../api/WorkSpace/get";

interface TeamSpaceProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const TeamSpace = ({ showInput, setShowInput }: TeamSpaceProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddTeam = () => {
    setShowInput(false);
  };

  const { data: spaceList } = useQuery({
    queryFn: GetSpaceList,
    queryKey: ["spaceList"],
  });

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">TEAM SPACES</p>
      {spaceList?.result?.map((space: TTeamSpace) => {
        const isActive =
          location.pathname.startsWith("/team-") &&
          location.pathname.includes(`/${space.workspaceId}`);
        return (
          <Space
            key={space.workspaceId}
            state="team"
            iconName="attachment"
            text={space.workspaceName}
            onClick={() => navigate(`/team-urls/${space.workspaceId}`)}
            spaceId={space.workspaceId}
            click={isActive}
          />
        );
      })}
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
