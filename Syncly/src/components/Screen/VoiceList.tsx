import people from "../../shared/api/mock/voiceList";
import Button from "../../shared/ui/Button";
import VoicePeople from "./VoicePeople";
import { useState } from "react";
import {
  RoomContext,
  // RoomAudioRenderer,
  // ControlBar,
} from "@livekit/components-react";
import { useLiveKitContext } from "../../context/LiveKitContext";

const VoiceList = ({
  setIsVoice,
}: {
  setIsVoice: (isVoice: boolean) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = people.find((person) => person.id === selectedId);
  const others = people.filter((person) => person.id !== selectedId);

  const { room, leaveRoom } = useLiveKitContext();

  return (
    <RoomContext.Provider value={room}>
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
        {selected ? (
          <div className="w-full h-full flex flex-col gap-3">
            <div className="w-full h-full flex justify-center items-center">
              <VoicePeople
                profile={selected.profile}
                onClick={() => setSelectedId(null)}
                size="large"
              />
            </div>
            <div className="w-full  flex gap-3">
              {others.map((person) => (
                <VoicePeople
                  key={person.id}
                  profile={person.profile}
                  onClick={() => setSelectedId(person.id)}
                  size="small"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full grid grid-cols-2 gap-3 justify-center md:grid-cols-1 lg:grid-cols-2">
            {people.map((person) => (
              <VoicePeople
                key={person.id}
                profile={person.profile}
                onClick={() => setSelectedId(person.id)}
                size="default"
              />
            ))}
          </div>
        )}
      </div>
    </RoomContext.Provider>
  );
};
export default VoiceList;
