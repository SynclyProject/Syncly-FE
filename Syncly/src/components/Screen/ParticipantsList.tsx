import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import People from "./People";
import { useQuery } from "@tanstack/react-query";
import { GetInitInfo, GetLiveToken } from "../../shared/api/Live";
import { useParams } from "react-router-dom";
import { useLiveKitContext } from "../../context/LiveKitContext";
import { useEffect } from "react";
import { RoomContext } from "@livekit/components-react";
import { TScreenInitInfo } from "../../shared/type/teamSpaceType";

const ParticipantsList = ({
  setIsVoice,
}: {
  setIsVoice: (isVoice: boolean) => void;
}) => {
  const { id } = useParams();
  const { joinRoom, setLiveKitToken, room } = useLiveKitContext();

  const { data } = useQuery({
    queryKey: ["live-room-members", id],
    queryFn: () => GetInitInfo({ workspaceId: Number(id) }),
  });

  const { data: liveKitToken } = useQuery({
    queryKey: ["liveKit-token", id],
    queryFn: () => GetLiveToken(Number(id)),
  });

  // liveKitToken이 변경될 때만 setLiveKitToken 호출
  useEffect(() => {
    if (liveKitToken?.result) {
      setLiveKitToken(liveKitToken.result);
    }
  }, [liveKitToken, setLiveKitToken]);

  return (
    <RoomContext.Provider value={room}>
      <div className="w-[335px] rounded-[10px] bg-white p-[14px] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 px-3 py-2 items-center rounded-[4px] border border-[#E0E0E0]">
            <Icon name="Sharing" />{" "}
            <p className="text-[16px] font-semibold">Participants</p>
          </div>
          <Button
            colorType="main"
            iconName="Phone"
            onClick={() => {
              joinRoom();
              setIsVoice(true);
            }}
          />
        </div>
        <div className="p-5 rounded-[4px] border border-[#E0E0E0] max-h-[332px] h-full flex flex-col gap-5 overflow-y-auto">
          {data?.result.participants.length > 0 ? (
            data?.result.participants.map((participant: TScreenInitInfo) => (
              <People
                key={participant.participantId}
                profile={participant.profileImageObjectKey || null}
                name={participant.participantName}
                audio={participant.audioSharing}
                screen={participant.screenSharing}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-[16px]">현재 음성채널에 아무도 없어요</p>
            </div>
          )}
        </div>
      </div>
    </RoomContext.Provider>
  );
};

export default ParticipantsList;
