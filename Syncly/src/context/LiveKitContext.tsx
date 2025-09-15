import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import { Room, RoomEvent } from "livekit-client";

type TLiveKitContext = {
  room: Room;
  micEnabled: boolean;
  camEnabled: boolean;
  screenSharing: boolean;
  connected: boolean;
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
  const [connected, setConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null);

  const serverUrl = import.meta.env.VITE_LIVEKIT_URL;

  // Room 이벤트 리스너 설정
  useEffect(() => {
    const handleConnected = () => {
      console.log("✅ LiveKit 방에 연결됨");
      setConnected(true);
    };

    const handleDisconnected = () => {
      console.log("❌ LiveKit 방 연결 해제됨");
      setConnected(false);
    };

    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
    };
  }, [room]);

  const joinRoom = async () => {
    try {
      if (liveKitToken) {
        console.log("🔄 LiveKit 방 연결 시도 중...");
        await room.connect(serverUrl, liveKitToken);
        // setConnected는 room 이벤트 리스너에서 처리됨
      } else {
        console.log("방 참가 실패 (이유: 라이브킷 토큰 발급 실패)");
      }
    } catch (error) {
      console.log("방 참가 실패 (이유: 라이브킷 연결 실패)", error);
      setConnected(false);
    }
  };

  const leaveRoom = () => {
    room.disconnect();
    setConnected(false);
  };

  const toggleMic = async () => {
    const newState = !micEnabled;
    await room.localParticipant.setMicrophoneEnabled(newState);
    setMicEnabled(newState);
  };

  const toggleCam = async () => {
    const newState = !camEnabled;
    await room.localParticipant.setCameraEnabled(newState);
    setCamEnabled(newState);
  };

  const toggleScreenSharing = async () => {
    const next = !screenSharing;
    setScreenSharing(next);
    try {
      // LiveKit 화면 공유 토글
      await room.localParticipant.setScreenShareEnabled(next);
    } catch (e) {
      // 실패 시 UI 상태를 원복
      setScreenSharing(!next);
      throw e;
    }
  };

  return (
    <LiveKitContext.Provider
      value={{
        room,
        micEnabled,
        camEnabled,
        screenSharing,
        connected,
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
