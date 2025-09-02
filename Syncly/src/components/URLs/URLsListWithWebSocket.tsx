import { useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useURLsList } from "../../hooks/useURLsList";
import URLsListContent from "./URLsListContent";

interface IURLsListWithWebSocketProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const URLsListWithWebSocket = ({
  showInput,
  setShowInput,
}: IURLsListWithWebSocketProps) => {
  const { spaceId, urlsTapListData, refetch } = useURLsList();
  const { isConnected, connect, subscribeToWorkspace } = useWebSocket();

  // 웹소켓 연결 및 구독
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token && !isConnected && spaceId) {
          await connect(token, spaceId);
        }
      } catch (error) {
        console.error("WebSocket 연결 실패:", error);
      }
    };

    initializeWebSocket();
  }, [connect, isConnected, spaceId]);

  // 워크스페이스 구독
  useEffect(() => {
    if (isConnected && spaceId) {
      try {
        subscribeToWorkspace(spaceId, (message) => {
          console.log("📨 웹소켓 메시지 수신:", message);
          // 실시간 업데이트를 위해 데이터 리페치
          refetch();
        });
      } catch (error) {
        console.error("워크스페이스 구독 실패:", error);
      }
    }
  }, [isConnected, spaceId, subscribeToWorkspace, refetch]);

  return (
    <URLsListContent
      showInput={showInput}
      setShowInput={setShowInput}
      urlsTapList={urlsTapListData}
    />
  );
};

export default URLsListWithWebSocket;
