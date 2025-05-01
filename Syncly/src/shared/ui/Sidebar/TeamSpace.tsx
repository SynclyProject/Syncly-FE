import TeamSpaceData from "../../api/mock/teamSpace";
import Space from "./Space";
import { useNavigate } from "react-router-dom";
import { TTeamSpace } from "../../type/teamSpaceType";
import InputSpace from "./InputSpace";

const TeamSpace = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">TEAM SPACES</p>
      {TeamSpaceData.map((space: TTeamSpace) => (
        <Space
          key={space.id}
          state="team"
          iconName="attachment"
          text={space.text}
          onClick={() => navigate("/")}
        />
      ))}
      <InputSpace />
    </div>
  );
};
export default TeamSpace;
