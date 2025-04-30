import Space from "../Space";
import { useNavigate } from "react-router-dom";

const TeamSpace = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">TEAM SPACES</p>
      <Space
        state="team"
        iconName="attachment"
        text="UMC"
        onClick={() => navigate("/")}
      />
      <Space
        state="team"
        iconName="folder_open"
        text="Project"
        onClick={() => navigate("/")}
      />
    </div>
  );
};
export default TeamSpace;
