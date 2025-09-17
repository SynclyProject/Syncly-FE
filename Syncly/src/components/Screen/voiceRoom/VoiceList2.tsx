import Button from "../../../shared/ui/Button";
import VoicePeople from "./VoicePeople";
import { useState } from "react";
import {
  RoomContext,
  RoomAudioRenderer,
  useTracks,
  TrackLoop,
  TrackRefContextIfNeeded,
  useTrackRefContext,
} from "@livekit/components-react";
import { useParticipants } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useLiveKitContext } from "../../../context/LiveKitContext";

// TrackLoop 내부에서 사용할 VoicePeople 래퍼 컴포넌트
const VoicePeopleWrapper = ({
  onSelect,
  size = "default",
}: {
  onSelect: (participantId: string | null) => void;
  size?: "small" | "large" | "default";
}) => {
  const participants = useParticipants();
  const trackRef = useTrackRefContext();

  const participant = participants.find(
    (p) => p.sid === trackRef?.participant.sid
  );
  const profile = participant?.identity || participant?.name || "User";

  return (
    <VoicePeople
      participantId={profile}
      onClick={() => onSelect(trackRef?.participant.sid || null)}
      size={size}
      showTracks={true}
    />
  );
};

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

      {/* 참가자 목록 */}
      {selected ? (
        <div className="w-full h-full flex flex-col gap-3">
          <div className="w-full h-full flex justify-center items-center">
            <TrackRefContextIfNeeded
              trackRef={tracks.find((t) => t.participant.sid === selectedId)}
            >
              <VoicePeople
                participantId={selected.identity || selected.name || "User"}
                onClick={() => setSelectedId(null)}
                size="large"
                showTracks={true}
              />
            </TrackRefContextIfNeeded>
          </div>
          <div className="w-full flex gap-3">
            <TrackLoop
              tracks={tracks.filter((t) => t.participant.sid !== selectedId)}
            >
              <VoicePeopleWrapper onSelect={setSelectedId} size="small" />
            </TrackLoop>
          </div>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-2 gap-3 justify-center md:grid-cols-1 lg:grid-cols-2">
          <TrackLoop tracks={tracks}>
            <VoicePeopleWrapper onSelect={setSelectedId} size="default" />
          </TrackLoop>
        </div>
      )}
    </div>
  );
};
export default VoiceList;
