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
  onSelect: (participantId: string | null, source?: Track.Source) => void;
  size?: "small" | "large" | "default";
}) => {
  const participants = useParticipants();
  const trackRef = useTrackRefContext();

  const participant = participants.find(
    (p) => p.sid === trackRef?.participant.sid
  );
  const participantId = participant?.identity;

  return (
    <VoicePeople
      participantId={String(participantId)}
      onClick={() =>
        onSelect(trackRef?.participant.sid || null, trackRef?.source)
      }
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
  const [selected, setSelected] = useState<{
    sid: string;
    source?: Track.Source;
  } | null>(null);
  const participants = useParticipants();
  const selectedParticipant = participants.find(
    (participant) => participant.sid === selected?.sid
  );

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="w-full flex flex-col gap-3 relative">
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
          <div className="w-full h-[60vh] flex justify-center items-center">
            <TrackRefContextIfNeeded
              trackRef={tracks.find(
                (t) =>
                  t.participant.sid === selected.sid &&
                  (selected.source ? t.source === selected.source : true)
              )}
            >
              <VoicePeople
                participantId={selectedParticipant?.identity || ""}
                onClick={() => setSelected(null)}
                size="large"
                showTracks={true}
              />
            </TrackRefContextIfNeeded>
          </div>
          <div className="w-full grid grid-cols-4 gap-3 md:grid-cols-3 sm:grid-cols-2">
            <TrackLoop
              tracks={tracks.filter(
                (t) =>
                  !(
                    t.participant.sid === selected.sid &&
                    (selected.source ? t.source === selected.source : false)
                  )
              )}
            >
              <VoicePeopleWrapper
                onSelect={(sid, source) =>
                  sid ? setSelected({ sid, source }) : setSelected(null)
                }
                size="small"
              />
            </TrackLoop>
          </div>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-2 gap-3 justify-center md:grid-cols-1 lg:grid-cols-2">
          <TrackLoop tracks={tracks}>
            <VoicePeopleWrapper
              onSelect={(sid, source) =>
                sid ? setSelected({ sid, source }) : setSelected(null)
              }
              size="default"
            />
          </TrackLoop>
        </div>
      )}
    </div>
  );
};
export default VoiceList;
