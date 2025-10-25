import * as Stomp from "stompjs";
import {
  TWebSocketMessage,
  TEditOperation,
  TEnterPayload,
  TEditPayload,
  TCursorPayload,
  TSavePayload,
} from "../type/note";

/**
 * WebSocket 서비스 - Note 실시간 편집
 */
export class NoteWebSocketService {
  private stompClient: Stomp.Client | null = null;
  private subscriptions: Map<string, Stomp.Subscription> = new Map();
  private isConnected = false;

  /**
   * WebSocket 연결
   * @param token JWT 토큰
   * @param onError 에러 콜백
   */
  connect(token: string, onError?: (error: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = () => {}; // 디버그 로그 비활성화

        this.stompClient.connect(
          { Authorization: `Bearer ${token}` },
          () => {
            console.log("✅ Note WebSocket 연결 성공!");
            this.isConnected = true;

            // 에러 큐 구독은 Promise 콜백 이후에 실행 (STOMP 완전 초기화 대기)
            Promise.resolve().then(() => {
              this.stompClient?.subscribe("/user/queue/errors", (message) => {
                const error = JSON.parse(message.body);
                console.error("❌ WebSocket 에러:", error);
                console.error("❌ 에러 상세:", JSON.stringify(error, null, 2));
                console.error("❌ 에러 payload:", error.payload);
                onError?.(error);
              });
            });

            resolve();
          },
          (error) => {
            console.error("❌ WebSocket 연결 실패:", error);
            this.isConnected = false;
            reject(error);
            onError?.(error);
          }
        );
      } catch (error) {
        console.error("❌ WebSocket 생성 실패:", error);
        reject(error);
      }
    });
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (this.stompClient && this.isConnected) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.stompClient.disconnect(() => {
        console.log("🔌 Note WebSocket 연결 해제됨");
        this.isConnected = false;
      });
    }
  }

  /**
   * 연결 상태 확인
   */
  getIsConnected(): boolean {
    return !!(this.isConnected && this.stompClient?.connected);
  }

  /**
   * 노트 입장 (ENTER)
   * @param noteId 노트 ID
   * @param onEnter ENTER 메시지 핸들러
   */
  subscribeToNoteEnter(
    noteId: number,
    onEnter: (payload: TEnterPayload) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // STOMP이 완전히 준비될 때까지 재시도
      const checkAndSubscribe = (retries = 0) => {
        if (!this.stompClient?.connected) {
          if (retries < 5) {
            console.log(`⏳ STOMP 준비 대기... (${retries + 1}/5)`);
            setTimeout(() => checkAndSubscribe(retries + 1), 100);
            return;
          }
          reject(new Error("WebSocket이 연결되지 않았습니다."));
          return;
        }

        const destination = `/app/notes/${noteId}/enter`;
        console.log(`📤 노트 입장 요청: ${destination}`);

        try {
          this.stompClient?.send(destination, {}, JSON.stringify({}));
        } catch (error) {
          console.error("❌ ENTER 메시지 전송 실패:", error);
          reject(new Error("노트 입장 요청 전송 실패"));
          return;
        }

        // 응답 구독 (유니캐스트)
        const userQueueTopic = `/user/queue/notes/${noteId}/enter`;
        if (this.subscriptions.has(userQueueTopic)) {
          this.subscriptions.get(userQueueTopic)?.unsubscribe();
        }

        const subscription = this.stompClient?.subscribe(
          userQueueTopic,
          (message) => {
            try {
              const response = JSON.parse(message.body);
              console.log("📨 ENTER 응답 수신:", response);
              onEnter(response.payload);
            } catch (error) {
              console.error("❌ ENTER 메시지 파싱 오류:", error);
            }
          }
        );

        if (subscription) {
          this.subscriptions.set(userQueueTopic, subscription);
          resolve();
        } else {
          reject(new Error("노트 입장 구독 실패"));
        }
      };

      checkAndSubscribe();
    });
  }

  /**
   * 노트 퇴장 (LEAVE)
   * @param noteId 노트 ID
   * @param onLeave LEAVE 메시지 핸들러
   */
  unsubscribeFromNote(noteId: number, onLeave?: () => void): void {
    if (!this.stompClient?.connected) {
      console.warn("WebSocket이 연결되지 않았습니다.");
      return;
    }

    const destination = `/app/notes/${noteId}/leave`;
    console.log(`📤 노트 퇴장 요청: ${destination}`);

    try {
      this.stompClient?.send(destination, {}, JSON.stringify({}));
    } catch (error) {
      console.error("❌ LEAVE 메시지 전송 실패:", error);
    }

    // 관련 구독 해제
    const topics = Array.from(this.subscriptions.keys()).filter((topic) =>
      topic.includes(`/notes/${noteId}`)
    );

    topics.forEach((topic) => {
      this.subscriptions.get(topic)?.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`🔌 구독 해제: ${topic}`);
    });

    onLeave?.();
  }

  /**
   * 실시간 편집 메시지 구독 (EDIT)
   * @param noteId 노트 ID
   * @param onEdit 편집 메시지 핸들러
   */
  subscribeToEdits(
    noteId: number,
    onEdit: (payload: TEditPayload) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const topic = `/topic/notes/${noteId}/edits`;
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(topic, (message) => {
      try {
        const response = JSON.parse(message.body);
        console.log("📨 EDIT 메시지 수신:", response);
        onEdit(response.payload);
      } catch (error) {
        console.error("❌ EDIT 메시지 파싱 오류:", error);
      }
    });

    if (subscription) {
      this.subscriptions.set(topic, subscription);
      console.log(`📨 편집 구독 시작: ${topic}`);
    }
  }

  /**
   * 편집 연산 전송 (EDIT)
   * @param noteId 노트 ID
   * @param operation 편집 연산
   */
  sendEdit(noteId: number, operation: TEditOperation): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = `/app/notes/${noteId}/edit`;
    const message = { operation };

    console.log(`📤 편집 전송:`, message);
    try {
      this.stompClient?.send(destination, {}, JSON.stringify(message));
    } catch (error) {
      console.error("❌ EDIT 메시지 전송 실패:", error);
      throw new Error("편집 전송 실패");
    }
  }

  /**
   * 커서 위치 메시지 구독 (CURSOR)
   * @param noteId 노트 ID
   * @param onCursor 커서 메시지 핸들러
   */
  subscribeToCursors(
    noteId: number,
    onCursor: (payload: TCursorPayload) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const topic = `/topic/notes/${noteId}/cursors`;
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(topic, (message) => {
      try {
        const response = JSON.parse(message.body);
        console.log("📨 CURSOR 메시지 수신:", response);
        onCursor(response.payload);
      } catch (error) {
        console.error("❌ CURSOR 메시지 파싱 오류:", error);
      }
    });

    if (subscription) {
      this.subscriptions.set(topic, subscription);
      console.log(`📨 커서 구독 시작: ${topic}`);
    }
  }

  /**
   * 커서 위치 업데이트 전송 (CURSOR)
   * @param noteId 노트 ID
   * @param position 커서 위치
   * @param range 선택 범위
   */
  sendCursor(noteId: number, position: number, range: number = 0): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = `/app/notes/${noteId}/cursor`;
    const message = { position, range };

    this.stompClient?.send(destination, {}, JSON.stringify(message));
  }

  /**
   * 저장 완료 메시지 구독 (SAVE)
   * @param noteId 노트 ID
   * @param onSave 저장 메시지 핸들러
   */
  subscribeToSave(
    noteId: number,
    onSave: (payload: TSavePayload) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const topic = `/topic/notes/${noteId}/save`;
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(topic, (message) => {
      try {
        const response = JSON.parse(message.body);
        console.log("📨 SAVE 메시지 수신:", response);
        onSave(response.payload);
      } catch (error) {
        console.error("❌ SAVE 메시지 파싱 오류:", error);
      }
    });

    if (subscription) {
      this.subscriptions.set(topic, subscription);
      console.log(`📨 저장 구독 시작: ${topic}`);
    }
  }

  /**
   * 참여자 변경 메시지 구독 (ENTER/LEAVE)
   * @param noteId 노트 ID
   * @param onParticipantChange 참여자 변경 핸들러
   */
  subscribeToParticipants(
    noteId: number,
    onParticipantChange: (message: TWebSocketMessage) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const topic = `/topic/notes/${noteId}/participants`;
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(topic, (message) => {
      try {
        const response = JSON.parse(message.body);
        console.log("📨 PARTICIPANTS 메시지 수신:", response);
        onParticipantChange(response);
      } catch (error) {
        console.error("❌ PARTICIPANTS 메시지 파싱 오류:", error);
      }
    });

    if (subscription) {
      this.subscriptions.set(topic, subscription);
      console.log(`📨 참여자 구독 시작: ${topic}`);
    }
  }

  // ========== CRUD 기능 관련 메서드 ==========

  /**
   * 노트 생성 요청 (CREATE)
   * @param workspaceId 워크스페이스 ID
   * @param title 노트 제목
   * @param onCreated 생성 완료 핸들러
   */
  createNote(
    workspaceId: number,
    title: string,
    onCreated: (payload: any) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = "/app/notes/create";
    const message = { workspaceId, title };

    console.log(`📤 노트 생성 요청: ${destination}`, message);

    this.stompClient?.send(destination, {}, JSON.stringify(message));

    // 응답 구독 (유니캐스트)
    const userQueueTopic = "/user/queue/notes/create";
    if (this.subscriptions.has(userQueueTopic)) {
      this.subscriptions.get(userQueueTopic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(
      userQueueTopic,
      (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("📨 CREATE 응답 수신:", response);
          onCreated(response.payload);
        } catch (error) {
          console.error("❌ CREATE 메시지 파싱 오류:", error);
        }
      }
    );

    if (subscription) {
      this.subscriptions.set(userQueueTopic, subscription);
    }
  }

  /**
   * 노트 목록 조회 요청 (LIST)
   * @param workspaceId 워크스페이스 ID
   * @param page 페이지 번호 (0-based)
   * @param size 페이지 크기
   * @param sortBy 정렬 기준
   * @param direction 정렬 방향
   * @param onListReceived 목록 수신 핸들러
   */
  getNoteList(
    workspaceId: number,
    page: number = 0,
    size: number = 20,
    sortBy: string = "lastModifiedAt",
    direction: string = "desc",
    onListReceived: (payload: any) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = "/app/notes/list";
    const message = { workspaceId, page, size, sortBy, direction };

    console.log(`📤 노트 목록 조회 요청: ${destination}`, message);

    this.stompClient?.send(destination, {}, JSON.stringify(message));

    // 응답 구독 (유니캐스트)
    const userQueueTopic = "/user/queue/notes/list";
    if (this.subscriptions.has(userQueueTopic)) {
      this.subscriptions.get(userQueueTopic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(
      userQueueTopic,
      (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("📨 LIST 응답 수신:", response);
          onListReceived(response.payload);
        } catch (error) {
          console.error("❌ LIST 메시지 파싱 오류:", error);
        }
      }
    );

    if (subscription) {
      this.subscriptions.set(userQueueTopic, subscription);
    }
  }

  /**
   * 노트 상세 조회 요청 (GET_DETAIL)
   * @param noteId 노트 ID
   * @param onDetailReceived 상세 정보 수신 핸들러
   */
  getNoteDetail(
    noteId: number,
    onDetailReceived: (payload: any) => void
  ): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = "/app/notes/detail";
    const message = { noteId };

    console.log(`📤 노트 상세 조회 요청: ${destination}`, message);

    this.stompClient?.send(destination, {}, JSON.stringify(message));

    // 응답 구독 (유니캐스트)
    const userQueueTopic = `/user/queue/notes/${noteId}/detail`;
    if (this.subscriptions.has(userQueueTopic)) {
      this.subscriptions.get(userQueueTopic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(
      userQueueTopic,
      (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("📨 GET_DETAIL 응답 수신:", response);
          onDetailReceived(response.payload);
        } catch (error) {
          console.error("❌ GET_DETAIL 메시지 파싱 오류:", error);
        }
      }
    );

    if (subscription) {
      this.subscriptions.set(userQueueTopic, subscription);
    }
  }

  /**
   * 노트 삭제 요청 (DELETE)
   * @param noteId 노트 ID
   * @param onDeleted 삭제 완료 핸들러
   */
  deleteNote(noteId: number, onDeleted: (payload: any) => void): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = "/app/notes/delete";
    const message = { noteId };

    console.log(`📤 노트 삭제 요청: ${destination}`, message);

    this.stompClient?.send(destination, {}, JSON.stringify(message));

    // 응답 구독 (유니캐스트)
    const userQueueTopic = `/user/queue/notes/${noteId}/delete`;
    if (this.subscriptions.has(userQueueTopic)) {
      this.subscriptions.get(userQueueTopic)?.unsubscribe();
    }

    const subscription = this.stompClient?.subscribe(
      userQueueTopic,
      (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("📨 DELETE 응답 수신:", response);
          onDeleted(response.payload);
        } catch (error) {
          console.error("❌ DELETE 메시지 파싱 오류:", error);
        }
      }
    );

    if (subscription) {
      this.subscriptions.set(userQueueTopic, subscription);
    }
  }

  /**
   * 노트 수동 저장 요청
   * @param noteId 노트 ID
   */
  saveNote(noteId: number): void {
    if (!this.stompClient?.connected) {
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const destination = `/app/notes/${noteId}/save`;

    console.log(`📤 노트 저장 요청: ${destination}`);

    try {
      this.stompClient?.send(destination, {}, JSON.stringify({}));
    } catch (error) {
      console.error("❌ SAVE 메시지 전송 실패:", error);
      throw new Error("저장 요청 전송 실패");
    }
  }

  /**
   * 노트 목록 업데이트 구독 (실시간 생성/삭제)
   * @param workspaceId 워크스페이스 ID
   * @param onListUpdate 목록 업데이트 핸들러
   */
  subscribeToNoteListUpdates(
    workspaceId: number,
    onListUpdate: (message: any) => void
  ): void {
    if (!this.stompClient?.connected) {
      console.error("❌ WebSocket 미연결 - 구독 실패");
      throw new Error("WebSocket이 연결되지 않았습니다.");
    }

    const topic = `/topic/workspace/${workspaceId}/notes/list`;
    if (this.subscriptions.has(topic)) {
      console.log(`♻️ 기존 구독 해제: ${topic}`);
      this.subscriptions.get(topic)?.unsubscribe();
    }

    console.log(`📡 노트 목록 구독 시작 요청: ${topic}`);
    const subscription = this.stompClient?.subscribe(
      topic,
      (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("📨 노트 목록 업데이트 메시지 수신:", response);
          onListUpdate(response);
        } catch (error) {
          console.error("❌ 노트 목록 업데이트 메시지 파싱 오류:", error);
        }
      },
      (error: any) => {
        console.error(`❌ 구독 오류 (${topic}):`, error);
      }
    );

    if (subscription) {
      this.subscriptions.set(topic, subscription);
      console.log(`✅ 노트 목록 구독 성공: ${topic}`);
    } else {
      console.error(`❌ 구독 실패: ${topic}`);
    }
  }

  /**
   * 노트 목록 업데이트 구독 해제
   * @param workspaceId 워크스페이스 ID
   */
  unsubscribeFromNoteListUpdates(workspaceId: number): void {
    const topic = `/topic/workspace/${workspaceId}/notes/list`;
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic)?.unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`🔌 노트 목록 구독 해제: ${topic}`);
    }
  }
}

// 싱글톤 인스턴스
let serviceInstance: NoteWebSocketService | null = null;

/**
 * NoteWebSocketService 싱글톤 인스턴스 반환
 */
export const getNoteWebSocketService = (): NoteWebSocketService => {
  if (!serviceInstance) {
    serviceInstance = new NoteWebSocketService();
  }
  return serviceInstance;
};
