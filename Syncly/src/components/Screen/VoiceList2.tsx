import Button from "../../shared/ui/Button";
import VoicePeople from "./VoicePeople";
import { useState } from "react";
import {
  RoomContext,
  RoomAudioRenderer,
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { useParticipants } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useLiveKitContext } from "../../context/LiveKitContext";

const VoiceList = ({
  setIsVoice,
}: {
  setIsVoice: (isVoice: boolean) => void;
}) => {
  const { room, leaveRoom } = useLiveKitContext();

  return (
    <RoomContext.Provider value={room}>
      <RoomAudioRenderer />
      <VoiceListContent setIsVoice={setIsVoice} leaveRoom={leaveRoom} />
    </RoomContext.Provider>
  );
};

const VoiceListContent = ({
  setIsVoice,
  leaveRoom,
}: {
  setIsVoice: (isVoice: boolean) => void;
  leaveRoom: () => void;
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const participants = useParticipants();
  const selected = participants.find(
    (participant) => participant.sid === selectedId
  );
  const others = participants.filter(
    (participant) => participant.sid !== selectedId
  );

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="w-full h-full flex flex-col gap-3 relative">
      <div className="w-full flex justify-between items-center">
        <p className="text-[20px] font-bold">Title</p>
        <Button
          colorType="red"
          iconName="Phone_off"
          onClick={() => {
            leaveRoom();
            setIsVoice(false);
          }}
        />
      </div>
      {/* 화면공유 트랙이 있을 때 화면공유 영역 표시 */}
      {tracks.some(
        (track) =>
          track.source === Track.Source.ScreenShare ||
          track.source === Track.Source.Camera
      ) && (
        <div className="w-full h-1/2 mb-4">
          <GridLayout
            tracks={tracks.filter(
              (track) =>
                track.source === Track.Source.ScreenShare ||
                track.source === Track.Source.Camera
            )}
          >
            <ParticipantTile />
          </GridLayout>
        </div>
      )}

      {/* 참가자 목록 */}
      {selected ? (
        <div className="w-full h-full flex flex-col gap-3">
          <div className="w-full h-full flex justify-center items-center">
            <VoicePeople
              profile={selected.identity || selected.name || "User"}
              onClick={() => setSelectedId(null)}
              size="large"
            />
          </div>
          <div className="w-full flex gap-3">
            {others.map((participant) => (
              <VoicePeople
                key={participant.sid}
                profile={participant.identity || participant.name || "User"}
                onClick={() => setSelectedId(participant.sid)}
                size="small"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-2 gap-3 justify-center md:grid-cols-1 lg:grid-cols-2">
          {participants.map((participant) => (
            <VoicePeople
              key={participant.sid}
              profile={participant.identity || participant.name || "User"}
              onClick={() => setSelectedId(participant.sid)}
              size="default"
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default VoiceList;
