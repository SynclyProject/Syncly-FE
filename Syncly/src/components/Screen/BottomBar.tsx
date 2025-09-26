import Button from "../../shared/ui/Button";
import { useLiveKitContext } from "../../context/LiveKitContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useChatList } from "../../hooks/useChatList";

const BottomBar = ({ isVoice }: { isVoice: boolean }) => {
  const [chatMessage, setChatMessage] = useState("");
  const { refetch: chatListRefetch } = useChatList();

  const {
    toggleMic,
    toggleScreenSharing,
    toggleCam,
    micEnabled,
    screenSharing,
    camEnabled,
  } = useLiveKitContext();

  const {
    isConnected,
    connect,
    subscribeToWorkspace,
    subscribeToChat,
    sendChat,
  } = useWebSocket();
  const { id } = useParams();
  const spaceId = Number(id);

  // 웹소켓 연결 및 구독
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token && !isConnected && spaceId) {
          await connect(token, spaceId);
          console.log("✅ WebSocket 연결 완료!");
        } else {
          console.log("⏭️ WebSocket 연결 건너뜀:", {
            hasToken: !!token,
            isConnected,
            hasSpaceId: !!spaceId,
          });
        }
      } catch (error) {
        console.error("❌ WebSocket 연결 실패:", error);
      }
    };

    initializeWebSocket();
  }, [connect, isConnected, spaceId]);

  // 워크스페이스, 채팅 구독
  useEffect(() => {
    if (isConnected && spaceId) {
      try {
        subscribeToWorkspace(spaceId, (message) => {
          console.log("📨 웹소켓 워크스페이스 메시지 수신:", message);
          // 실시간 업데이트를 위해 데이터 리페치
        });
        subscribeToChat(spaceId, (message) => {
          console.log("📨 웹소켓 채팅 메시지 수신:", message);
        });
      } catch (error) {
        console.error("워크스페이스, 채팅 구독 실패:", error);
      }
    }
  }, [isConnected, spaceId, subscribeToWorkspace, subscribeToChat]);

  const handleSendChat = () => {
    const messageToSend = chatMessage.trim();
    if (!messageToSend || !isConnected || !spaceId) return;
    sendChat(spaceId, messageToSend);
    setChatMessage("");
    chatListRefetch();
  };
  return (
    <div className="w-full flex gap-2 ">
      {isVoice ? (
        <>
          <Button
            iconName={screenSharing ? "Screen" : "Screen_off"}
            colorType="white"
            onClick={toggleScreenSharing}
          />
          <Button
            iconName={camEnabled ? "Cam_on" : "Cam_off"}
            colorType="white"
            onClick={toggleCam}
          />
          <Button
            iconName={micEnabled ? "Microphone_on" : "Microphone_off"}
            colorType="white"
            onClick={toggleMic}
          />
        </>
      ) : (
        <></>
      )}

      <input
        className="w-full border border-[#E0E0E0] bg-white rounded-[8px] p-[10px] outline-none"
        placeholder="Enter your Message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendChat();
          }
        }}
        onChange={(e) => setChatMessage(e.target.value)}
        value={chatMessage}
      />
    </div>
  );
};
export default BottomBar;
