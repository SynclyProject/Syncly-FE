import { useEffect, useState } from "react";
import { ExtensionResponse } from "../shared/type/extension";
import { GetAllTaps } from "../shared/api/URL/getList";
import { TMySpaceURLs } from "../shared/type/mySpaceType";
import { TUrl } from "../shared/type/mySpaceType";

export const useExtension = (tabId: number, spaceId: number) => {
  // Chrome Extension 관련 상태
  const [loading, setLoading] = useState(false);
  const [extensionId, setExtensionId] = useState<string | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<number | string | null>(
    null
  );
  /** ── Extension ID 동적 획득 ───────────────────────────────────── */
  useEffect(() => {
    const handleExtensionReady = (
      event: CustomEvent<{ extensionId?: string }>
    ) => {
      const id = event.detail?.extensionId ?? null;
      setExtensionId(id);
      console.log("✅ Extension ID 감지:", id);
    };

    // 커스텀 이벤트 리스너 등록
    // TS 오버로드 문제 피하려고 as EventListener 캐스팅
    window.addEventListener(
      "SYNCLY_EXTENSION_READY",
      handleExtensionReady as EventListener
    );

    // 이벤트를 놓쳤을 때 대비 (content.js에서 인라인 주입으로 세팅해둔 전역변수)
    if (window.SYNCLY_EXTENSION_ID) {
      setExtensionId(window.SYNCLY_EXTENSION_ID);
    } else {
      // 디버깅용
      setTimeout(() => {
        if (!window.SYNCLY_EXTENSION_ID) {
          console.log("⏳ Extension ID 대기 중...");
        }
      }, 1000);
    }

    return () => {
      window.removeEventListener(
        "SYNCLY_EXTENSION_READY",
        handleExtensionReady as EventListener
      );
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(timestamp, message);
  };

  /** ── Extension 설치/사용 가능 여부 ─────────────────────────────── */
  const isExtensionInstalled = () => {
    return (
      typeof window.chrome !== "undefined" &&
      !!window.chrome.runtime &&
      !!extensionId
    );
  };

  /** ── Extension 메시지 전송 헬퍼 ───────────────────────────────── */
  const sendMessageToExtension = (
    message: unknown
  ): Promise<ExtensionResponse> =>
    new Promise((resolve, reject) => {
      if (!isExtensionInstalled()) {
        reject(new Error("Chrome Extension이 설치되지 않았습니다."));
        return;
      }
      if (!extensionId) {
        reject(new Error("Extension ID를 찾을 수 없습니다."));
        return;
      }

      try {
        window.chrome?.runtime?.sendMessage?.(
          extensionId,
          message,
          (response: unknown) => {
            const lastError = window.chrome?.runtime?.lastError?.message;
            if (lastError) {
              reject(new Error(lastError));
              return;
            }
            const extResponse = response as ExtensionResponse;
            if (extResponse?.success) resolve(extResponse);
            else reject(new Error(extResponse?.error || "알 수 없는 에러"));
          }
        );
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });

  /** ── 1) SAVE_TABS ─────────────────────────────────────────────── */
  const handleSaveTabs = async () => {
    setLoading(true);
    addLog("🔄 탭 저장 시작...");

    try {
      const jwtToken = localStorage.getItem("accessToken");
      addLog(
        `📤 Extension에 SAVE_TABS 요청 전송 (토큰: ${jwtToken?.substring(
          0,
          20
        )}...)`
      );

      const response = await sendMessageToExtension({
        action: "SAVE_TABS",
        token: jwtToken,
      });

      addLog("✅ 탭 저장 성공!");
      addLog(`📊 응답 데이터: ${JSON.stringify(response.data)}`);

      const sessionId = response.data?.id;
      if (sessionId !== undefined) {
        addLog(`📊 세션 ID: ${sessionId}`);
        setSavedSessionId(sessionId);
      }

      const count = response.count ?? response.data?.count ?? 0;
      addLog(`📊 저장된 URL 개수: ${count}`);

      if (Array.isArray(response.data?.urls)) {
        const urls = response.data!.urls!;
        addLog(
          `📋 URLs: ${JSON.stringify(urls.slice(0, 3))}${
            urls.length > 3 ? "..." : ""
          }`
        );
      }

      alert(
        `✅ ${count}개의 탭이 저장되었습니다!${
          sessionId ? ` (ID: ${sessionId})` : ""
        }`
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`❌ 탭 저장 실패: ${msg}`);
      alert(`❌ 저장 실패: ${msg}`);
      console.error("탭 저장 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  /** ── 2) OPEN_LINKS (워크스페이스 탭 조회 → 선택 → 열기) ───────── */
  const handleOpenTabsById = async () => {
    setLoading(true);
    addLog(`🔄 Workspace ${spaceId}의 탭 목록 가져오는 중...`);

    try {
      addLog(
        `📤 Spring API에 GET 요청: /api/workspaces/${spaceId}/tabs-with-urls`
      );

      const response = await GetAllTaps({ workspaceId: spaceId });

      const tabs = response.result?.tabs;
      addLog(`✅ ${tabs.length}개의 탭 조회 성공!`);

      if (!tabs.length) {
        addLog("ℹ️ 열 수 있는 탭이 없습니다.");
        setLoading(false);
        return;
      }

      const defaultId = tabId;

      const selectedTab = tabs.find((t: TMySpaceURLs) => t.tabId === defaultId);
      if (!selectedTab) {
        throw new Error(`Tab ID ${defaultId}를 찾을 수 없습니다.`);
      }

      addLog(
        `🎯 선택된 탭: ${selectedTab.tabName} (${selectedTab.urls.length}개 URL)`
      );

      const urls = selectedTab.urls
        .map((u: TUrl) => u.url)
        .filter((u: TUrl) => typeof u === "string");
      addLog(
        `📋 URLs: ${JSON.stringify(urls.slice(0, 3))}${
          urls.length > 3 ? "..." : ""
        }`
      );

      addLog("📤 Extension에 OPEN_LINKS 요청 전송");

      const openResponse = await sendMessageToExtension({
        action: "OPEN_LINKS",
        urls,
      });

      const opened = openResponse.count ?? urls.length;
      addLog(`✅ 링크 열기 성공! ${opened}개의 탭이 열렸습니다.`);
      alert(`✅ ${opened}개의 탭이 열렸습니다!`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      addLog(`❌ 탭 열기 실패: ${msg}`);
      alert(`❌ 탭 열기 실패: ${msg}`);
      console.error("탭 열기 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    extensionId,
    savedSessionId,
    handleSaveTabs,
    handleOpenTabsById,
  };
};
