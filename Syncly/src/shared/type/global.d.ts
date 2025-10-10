export {};

declare global {
  interface Window {
    SYNCLY_EXTENSION_ID?: string;
    chrome?: typeof chrome; // 필요 시 @types/chrome 설치해도 OK
  }

  interface DocumentEventMap {
    // 우리 커스텀 이벤트 타입 등록
    SYNCLY_EXTENSION_READY: CustomEvent<{ extensionId?: string }>;
  }
}
