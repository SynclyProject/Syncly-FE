import { useEffect, useRef, useState, useCallback } from "react";
import * as Stomp from "stompjs";
import { TMySpaceURLs } from "../shared/type/mySpaceType";

interface WebSocketMessage {
  workspaceId: number;
  urlTabName?: string;
  urlTabId?: number;
  newUrlTabName?: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: (token: string, workspaceId: number) => Promise<void>;
  disconnect: () => void;
  createUrlTab: (workspaceId: number, urlTabName: string) => void;
  deleteUrlTab: (workspaceId: number, urlTabId: number) => void;
  updateUrlTabName: (
    workspaceId: number,
    urlTabId: number,
    newUrlTabName: string
  ) => void;
  subscribeToWorkspace: (
    workspaceId: number,
    callback: (message: TMySpaceURLs) => void
  ) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const subscriptionsRef = useRef<Map<string, Stomp.Subscription>>(new Map());

  const connect = useCallback(
    async (token: string, workspaceId: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        // 개발 환경에서는 HTTP, 프로덕션에서는 HTTPS 사용
        // const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const socket = new WebSocket(`wss://www.syncly-io.com/ws-stomp`);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {};

        stompClient.connect(
          { Authorization: "Bearer " + token },
          () => {
            console.log("✅ WebSocket 연결 성공!");
            stompClientRef.current = stompClient;
            stompClient.subscribe(
              `/topic/workspace.${workspaceId}`,
              (message) => {
                const body = JSON.parse(message.body);
                console.log("📨 수신 메시지: " + JSON.stringify(body));
              }
            );

            stompClient.subscribe("user/queue/errors", (message) => {
              const error = JSON.parse(message.body);
              console.error("❌ 오류 메시지: " + JSON.stringify(error));
            });
            setIsConnected(true);
            resolve();
          },
          (error) => {
            console.error("❌ WebSocket 연결 실패:", error);
            reject(error);
          }
        );
      });
    },
    []
  );

  const disconnect = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      // 모든 구독 해제
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();

      stompClientRef.current.disconnect(() => {
        console.log("WebSocket 연결이 정상적으로 해제되었습니다.");
      });
      stompClientRef.current = null;
      setIsConnected(false);
      console.log("🔌 WebSocket 연결 해제됨");
    }
  }, []);

  const createUrlTab = useCallback(
    (workspaceId: number, urlTabName: string) => {
      if (!stompClientRef.current?.connected) {
        throw new Error("WebSocket이 연결되지 않았습니다.");
      }

      const message: WebSocketMessage = { workspaceId, urlTabName };
      stompClientRef.current.send(
        "/app/createTab",
        {},
        JSON.stringify(message)
      );
      console.log("🚀 탭 생성 요청 전송됨:", message);
    },
    []
  );

  const deleteUrlTab = useCallback((workspaceId: number, urlTabId: number) => {
    if (!stompClientRef.current?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const message: WebSocketMessage = { workspaceId, urlTabId };
    stompClientRef.current.send("/app/deleteTab", {}, JSON.stringify(message));
    console.log("🗑️ 탭 삭제 요청 전송됨:", message);
  }, []);

  const updateUrlTabName = useCallback(
    (workspaceId: number, urlTabId: number, newUrlTabName: string) => {
      if (!stompClientRef.current?.connected) {
        throw new Error("WebSocket이 연결되지 않았습니다.");
      }

      const message: WebSocketMessage = {
        workspaceId,
        urlTabId,
        newUrlTabName,
      };
      stompClientRef.current.send(
        "/app/updateTabName",
        {},
        JSON.stringify(message)
      );
      console.log("✏️ 탭 이름 변경 요청 전송됨:", message);
    },
    []
  );

  const subscribeToWorkspace = useCallback(
    (workspaceId: number, callback: (message) => void) => {
      if (!stompClientRef.current?.connected) {
        throw new Error("WebSocket이 연결되지 않았습니다.");
      }

      const topic = `/topic/workspace.${workspaceId}`;

      // 기존 구독이 있다면 해제
      if (subscriptionsRef.current.has(topic)) {
        subscriptionsRef.current.get(topic)?.unsubscribe();
      }

      // 새로운 구독 생성
      const subscription = stompClientRef.current.subscribe(
        topic,
        (message) => {
          try {
            const body = JSON.parse(message.body);
            callback(body);
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
          }
        }
      );

      subscriptionsRef.current.set(topic, subscription);
      console.log(`📨 워크스페이스 ${workspaceId} 구독 시작`);
    },
    []
  );

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    createUrlTab,
    deleteUrlTab,
    updateUrlTabName,
    subscribeToWorkspace,
  };
};
