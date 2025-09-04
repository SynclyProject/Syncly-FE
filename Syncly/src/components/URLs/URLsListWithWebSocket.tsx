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
  const {
    isConnected,
    connect,
    subscribeToWorkspace,
    createUrlTab,
    deleteUrlTab,
    addUrl,
    deleteUrl,
    updateUrlTabName,
  } = useWebSocket();

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

  // 웹소켓 액션 핸들러
  const handleWebSocketAction = (
    action: string,
    data: Record<string, unknown>
  ) => {
    if (!isConnected) {
      console.error("웹소켓이 연결되지 않았습니다.");
      return;
    }

    switch (action) {
      case "createUrlTab":
        try {
          createUrlTab(data.workspaceId as number, data.urlTabName as string);
        } catch (error) {
          console.error("탭 생성 실패:", error);
        }
        break;
      case "deleteUrlTab":
        try {
          deleteUrlTab(data.workspaceId as number, data.urlTabId as number);
        } catch (error) {
          console.error("탭 삭제 실패:", error);
        }
        break;
      case "updateUrlTabName":
        try {
          updateUrlTabName(
            data.workspaceId as number,
            data.urlTabId as number,
            data.newTabName as string
          );
        } catch (error) {
          console.error("탭 이름 변경 실패:", error);
        }
        break;
      case "addUrl":
        try {
          addUrl(data.tabId as number, data.url as string);
        } catch (error) {
          console.error("URL 추가 실패:", error);
        }
        break;
      case "deleteUrl":
        try {
          deleteUrl(data.tabId as number, data.urlItemId as number);
        } catch (error) {
          console.error("URL 삭제 실패:", error);
        }
        break;
      default:
        console.warn("알 수 없는 웹소켓 액션:", action);
    }
  };

  return (
    <URLsListContent
      showInput={showInput}
      setShowInput={setShowInput}
      urlsTapList={urlsTapListData}
      communicationType="websocket"
      workspaceId={spaceId}
      onWebSocketAction={handleWebSocketAction}
    />
  );
};

export default URLsListWithWebSocket;
