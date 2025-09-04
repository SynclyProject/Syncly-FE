import { useEffect, useRef, useState, useCallback } from "react";
import * as Stomp from "stompjs";
import { TMySpaceURLs } from "../shared/type/mySpaceType";
import { UseWebSocketReturn, WebSocketMessage } from "../shared/type/webSocket";

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const subscriptionsRef = useRef<Map<string, Stomp.Subscription>>(new Map());

  const connect = useCallback(
    async (token: string, workspaceId: number): Promise<void> => {
      return new Promise((resolve, reject) => {
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

            console.log("🔄 isConnected 상태를 true로 설정...");
            setIsConnected(true);
            console.log("✅ WebSocket 연결 및 상태 설정 완료!");
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

  const addUrl = useCallback((tabId: number, url: string) => {
    console.log("🔍 addUrl 호출:", {
      tabId,
      url,
      connected: stompClientRef.current?.connected,
    });

    if (!stompClientRef.current?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const message: WebSocketMessage = {
      tabId,
      url,
    };

    // 현재 구독 상태 확인
    console.log(
      "📨 현재 구독 목록:",
      Array.from(subscriptionsRef.current.keys())
    );

    stompClientRef.current.send("/app/addUrl", {}, JSON.stringify(message));

    console.log("🔗 URL 추가 요청 전송됨:", message);
  }, []);

  const deleteUrl = useCallback((tabId: number, urlItemId: number) => {
    if (!stompClientRef.current?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }
    const message: WebSocketMessage = {
      tabId,
      urlItemId,
    };
    stompClientRef.current.send("/app/deleteUrl", {}, JSON.stringify(message));
    console.log("🔗 URL 삭제 요청 전송됨:", message);
  }, []);

  //워크스페이스 1회 구독
  const subscribeToWorkspace = useCallback(
    (workspaceId: number, callback: (message: TMySpaceURLs) => void) => {
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

  // 탭 N회 구독
  const subscribeToTab = useCallback(
    (tabId: number, callback: (message: TMySpaceURLs) => void) => {
      if (!stompClientRef.current?.connected) {
        throw new Error("WebSocket이 연결되지 않았습니다.");
      }

      const topic = `/topic/tab.${tabId}`;
      console.log("🔍 탭 구독 토픽:", topic);

      // 기존 구독이 있다면 해제
      if (subscriptionsRef.current.has(topic)) {
        console.log("🔌 기존 구독 해제:", topic);
        subscriptionsRef.current.get(topic)?.unsubscribe();
      }

      // 새로운 구독 생성
      const subscription = stompClientRef.current.subscribe(
        topic,
        (message) => {
          console.log("📨 원시 메시지 수신:", message.body);
          try {
            const body = JSON.parse(message.body);
            console.log("📨 파싱된 메시지:", body);
            callback(body);
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
          }
        }
      );
      subscriptionsRef.current.set(topic, subscription);
      console.log(
        "📨 현재 구독 목록:",
        Array.from(subscriptionsRef.current.keys())
      );
    },
    []
  );

  // 특정 탭 구독 해제
  const unsubscribeFromTab = useCallback((tabId: number) => {
    const topic = `/topic/tab.${tabId}`;
    if (subscriptionsRef.current.has(topic)) {
      subscriptionsRef.current.get(topic)?.unsubscribe();
      subscriptionsRef.current.delete(topic);
      console.log(`📨 탭 ${tabId} 구독 해제됨`);
    }
  }, []);

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
    addUrl,
    deleteUrl,
    subscribeToWorkspace,
    subscribeToTab,
    unsubscribeFromTab,
  };
};
