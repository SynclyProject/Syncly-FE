import { useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const TestPage = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [urlTabName, setUrlTabName] = useState("");
  const [urlTabId, setUrlTabId] = useState("");
  const [updateTabId, setUpdateTabId] = useState("");
  const [newTabName, setNewTabName] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const {
    isConnected,
    connect,
    disconnect,
    createUrlTab,
    deleteUrlTab,
    updateUrlTabName,
    subscribeToWorkspace,
  } = useWebSocket();

  const log = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleConnect = async () => {
    if (!jwtToken.trim()) {
      log("❌ 토큰을 입력해주세요.");
      return;
    }

    try {
      await connect(jwtToken);
      log("✅ WebSocket 연결 성공!");

      // 워크스페이스 구독
      if (workspaceId) {
        subscribeToWorkspace(Number(workspaceId), (message) => {
          log("📨 수신 메시지: " + JSON.stringify(message));
        });
      }
    } catch (error) {
      log("❌ WebSocket 연결 실패: " + error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    log("🔌 WebSocket 연결 해제됨");
  };

  const handleCreateUrlTab = () => {
    if (!workspaceId || !urlTabName) {
      log("❗ 워크스페이스 ID와 탭 이름을 입력해주세요.");
      return;
    }

    try {
      createUrlTab(Number(workspaceId), urlTabName);
      log(
        `🚀 탭 생성 요청 전송됨 (workspaceId=${workspaceId}, name=${urlTabName})`
      );
    } catch {
      log("⚠️ 먼저 WebSocket에 연결하세요.");
    }
  };

  const handleDeleteUrlTab = () => {
    if (!workspaceId || !urlTabId) {
      log("❗ 워크스페이스 ID와 URL 탭 ID를 입력해주세요.");
      return;
    }

    try {
      deleteUrlTab(Number(workspaceId), Number(urlTabId));
      log(
        `🗑️ 탭 삭제 요청 전송됨 (workspaceId=${workspaceId}, urlTabId=${urlTabId})`
      );
    } catch {
      log("⚠️ 먼저 WebSocket에 연결하세요.");
    }
  };

  const handleUpdateUrlTabName = () => {
    if (!workspaceId || !updateTabId || !newTabName) {
      log("❗ 워크스페이스 ID, 탭 ID, 새 이름을 모두 입력해주세요.");
      return;
    }

    try {
      updateUrlTabName(Number(workspaceId), Number(updateTabId), newTabName);
      log(
        `✏️ 탭 이름 변경 요청 전송됨 (workspaceId=${workspaceId}, urlTabId=${updateTabId}, newName=${newTabName})`
      );
    } catch {
      log("⚠️ 먼저 WebSocket에 연결하세요.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        🔐 JWT 기반 URL 탭 WebSocket 테스트
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            JWT 토큰 입력:
          </label>
          <input
            type="text"
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="토큰만 입력 (Bearer 생략)"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConnect}
            disabled={isConnected}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            1️⃣ CONNECT (WebSocket + STOMP)
          </button>
          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              🔌 DISCONNECT
            </button>
          )}
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              워크스페이스 ID:
            </label>
            <input
              type="text"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="예: 7"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              URL 탭 이름:
            </label>
            <input
              type="text"
              value={urlTabName}
              onChange={(e) => setUrlTabName(e.target.value)}
              placeholder="예: 졸업프로젝트 관련 URL 모음"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          onClick={handleCreateUrlTab}
          disabled={!isConnected}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          2️⃣ 탭 생성 요청 보내기
        </button>

        <hr className="my-6" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              삭제할 URL 탭 ID:
            </label>
            <input
              type="text"
              value={urlTabId}
              onChange={(e) => setUrlTabId(e.target.value)}
              placeholder="예: 15"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          onClick={handleDeleteUrlTab}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          3️⃣ 탭 삭제 요청 보내기
        </button>

        <hr className="my-6" />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              이름 변경할 URL 탭 ID:
            </label>
            <input
              type="text"
              value={updateTabId}
              onChange={(e) => setUpdateTabId(e.target.value)}
              placeholder="예: 15"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              새 URL 탭 이름:
            </label>
            <input
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="예: 변경된 탭 이름"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          onClick={handleUpdateUrlTabName}
          disabled={!isConnected}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:bg-gray-400"
        >
          4️⃣ 탭 이름 변경 요청 보내기
        </button>

        <hr className="my-6" />

        <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
          <h3 className="font-medium mb-2">로그:</h3>
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
