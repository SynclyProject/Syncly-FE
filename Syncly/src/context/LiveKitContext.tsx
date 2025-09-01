import { createContext, useState, useContext, PropsWithChildren } from "react";
import { Room } from "livekit-client";

type TLiveKitContext = {
  room: Room;
  micEnabled: boolean;
  camEnabled: boolean;
  screenSharing: boolean;
  joinRoom: () => Promise<void>;
  leaveRoom: () => void;
  toggleMic: () => Promise<void>;
  toggleCam: () => Promise<void>;
  toggleScreenSharing: () => Promise<void>;
  liveKitToken: string | null;
  setLiveKitToken: (token: string | null) => void;
};

const LiveKitContext = createContext<TLiveKitContext | null>(null);

export const LiveKitProvider = ({ children }: PropsWithChildren) => {
  const [room] = useState(() => new Room({ adaptiveStream: true }));
  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);

  const serverUrl = import.meta.env.VITE_LIVEKIT_URL;

  const joinRoom = async () => {
    try {
      if (liveKitToken) {
        await room.connect(serverUrl, liveKitToken);
      } else console.log("방 참가 실패 (이유: 라이브킷 토큰 발급 실패)");
    } catch (error) {
      console.log("방 참가 실패 (이유: 라이브킷 연결 실패)", error);
    }
  };

  const leaveRoom = () => {
    room.disconnect();
  };

  const toggleMic = async () => {
    setMicEnabled(!micEnabled);
    await room.localParticipant.setMicrophoneEnabled(!micEnabled);
  };

  const toggleCam = async () => {
    setCamEnabled(!camEnabled);
    await room.localParticipant.setCameraEnabled(!camEnabled);
  };

  const toggleScreenSharing = async () => {
    setScreenSharing(!screenSharing);
    await room.localParticipant.setCameraEnabled(!screenSharing);
  };

  return (
    <LiveKitContext.Provider
      value={{
        room,
        micEnabled,
        camEnabled,
        screenSharing,
        joinRoom,
        leaveRoom,
        toggleMic,
        toggleCam,
        toggleScreenSharing,
        liveKitToken,
        setLiveKitToken,
      }}
    >
      {children}
    </LiveKitContext.Provider>
  );
};

export function useLiveKitContext() {
  const context = useContext(LiveKitContext);
  if (context == null) {
    throw new Error("LiveKitProvider를 찾을 수 없습니다.");
  }

  return context;
}
