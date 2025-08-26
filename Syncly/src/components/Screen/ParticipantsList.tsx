import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import People from "./People";
import { useQuery } from "@tanstack/react-query";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { GetInitInfo } from "../../shared/api/Live";

const ParticipantsList = ({
  setIsVoice,
}: {
  setIsVoice: (isVoice: boolean) => void;
}) => {
  const { workspaceId } = useWorkSpaceContext();

  const { data } = useQuery({
    queryKey: ["live-room-members", workspaceId],
    queryFn: () => GetInitInfo(workspaceId),
  });

  console.log(data);

  return (
    <div className="w-[335px] rounded-[10px] bg-white p-[14px] flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 px-3 py-2 items-center rounded-[4px] border border-[#E0E0E0]">
          <Icon name="Sharing" />{" "}
          <p className="text-[16px] font-semibold">Participants</p>
        </div>
        <Button
          colorType="main"
          iconName="Phone"
          onClick={() => setIsVoice(true)}
        />
      </div>
      <div className="p-5 rounded-[4px] border border-[#E0E0E0] max-h-[332px] h-full flex flex-col gap-5 overflow-y-auto">
        <People profile="User_Circle" name="John Doe" />
        <People profile="User_Circle" name="John Doe" />
        <People profile="User_Circle" name="John Doe" />
      </div>
    </div>
  );
};

export default ParticipantsList;
