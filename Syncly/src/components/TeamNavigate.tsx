import Icon from "../shared/ui/Icon";
import { useNavigate, useParams } from "react-router-dom";

type TStateProp = {
  state: "urls" | "files" | "screen";
};

const TeamNavigate = ({ state }: TStateProp) => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="flex">
      <div
        className={
          `w-[173px] h-[32px] flex items-center px-3 gap-2 ` +
          (state === "urls"
            ? "bg-white border-b border-b-[#028090] rounded-[4px] hover:cursor-pointer"
            : "hover:cursor-pointer")
        }
        onClick={() => navigate(`/team-urls/${id}`)}
      >
        <Icon name="attachment" />
        <p className="text-[16px] font-semibold ">URLs</p>
      </div>
      <div
        className={
          `w-[173px] h-[32px] flex items-center px-3 gap-2 ` +
          (state === "files"
            ? "bg-white border-b border-b-[#028090] rounded-[4px] hover:cursor-pointer"
            : "hover:cursor-pointer")
        }
        onClick={() => navigate(`/team-files/${id}`)}
      >
        <Icon name="folder_open" />
        <p className="text-[16px] font-semibold">Files</p>
      </div>
      <div
        className={
          `w-[173px] h-[32px] flex items-center px-3 gap-2 ` +
          (state === "screen"
            ? "bg-white border-b border-b-[#028090] rounded-[4px] hover:cursor-pointer"
            : "hover:cursor-pointer")
        }
        onClick={() => navigate(`/team-screen/${id}`)}
      >
        <Icon name="Sharing" />
        <p className="text-[16px] font-semibold">Screen Sharing</p>
      </div>
    </div>
  );
};

export default TeamNavigate;
