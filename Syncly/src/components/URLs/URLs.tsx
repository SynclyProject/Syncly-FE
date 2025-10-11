import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import Url from "./Url";
import URLsModal from "./URLsModal";
import { TMySpaceURLs, TUrl } from "../../shared/type/mySpaceType";
import { useState, useRef, useEffect } from "react";
import { PatchTaps, PostTabItems } from "../../shared/api/URL/personal";
import { useMutation } from "@tanstack/react-query";
import { useURLsList } from "../../hooks/useURLsList";
import { useParams } from "react-router-dom";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { useExtension } from "../../hooks/useExtension";

interface IURLsProps {
  title: string;
  urls: TUrl[];
  tabId: number;
  index: number;
  dragStart: (e: React.MouseEvent, position: number) => void;
  dragEnter: (e: React.MouseEvent, position: number) => void;
  drop: () => void;
  onWebSocketAction?: (action: string, data: Record<string, unknown>) => void;
  communicationType?: "http" | "websocket";
  isConnected: boolean;
  subscribeToTab: (
    tabId: number,
    callback: (message: TMySpaceURLs) => void
  ) => void;
  unsubscribeFromTab: (tabId: number) => void;
}

const URLs = ({
  title,
  urls,
  tabId,
  index,
  dragStart,
  dragEnter,
  drop,
  onWebSocketAction,
  communicationType,
  isConnected,
  subscribeToTab,
  unsubscribeFromTab,
}: IURLsProps) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(title);

  const { personalSpaceId } = useWorkSpaceContext();
  const { id } = useParams();
  const spaceId = communicationType === "http" ? personalSpaceId : Number(id);

  const {
    loading,
    handleSaveTabs,
    handleOpenTabsById,
    extensionId,
    sendMessageToExtension,
  } = useExtension(tabId, spaceId);

  // FileList.tsx 패턴으로 spaceId 설정

  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

  const { refetch } = useURLsList();

  // 탭 구독
  useEffect(() => {
    // subscribeToTab 함수가 없으면 구독하지 않음
    if (!subscribeToTab) {
      return;
    }

    try {
      subscribeToTab(tabId, () => {
        // 탭 관련 변경사항이 있을 때 데이터 리페치
        refetch();
      });
      console.log("✅ 탭 구독 성공:", tabId);
    } catch (error) {
      console.error("❌ 탭 구독 실패:", error);
    }

    // 컴포넌트 언마운트 시 탭 구독 해제
    return () => {
      if (unsubscribeFromTab) {
        console.log("🔌 탭 구독 해제:", tabId);
        unsubscribeFromTab(tabId);
      }
    };
  }, [subscribeToTab, tabId, refetch, unsubscribeFromTab, isConnected]);

  const { mutate: patchTapsMutation } = useMutation({
    mutationFn: PatchTaps,
    onSuccess: () => {
      setEditTitle(false);
      refetch();
    },
  });

  const { mutate: postUrlsMutation } = useMutation({
    mutationFn: PostTabItems,
    onSuccess: () => {
      refetch();
    },
  });

  const handleTitleChange = (value: string) => {
    setEditTitleValue(value);
  };
  const handleTitleSubmit = () => {
    if (!editTitleValue.trim()) return;
    if (communicationType === "http") {
      patchTapsMutation({ tabId: tabId, urlTabName: editTitleValue });
    } else if (communicationType === "websocket" && onWebSocketAction) {
      onWebSocketAction("updateUrlTabName", {
        workspaceId: spaceId,
        urlTabId: tabId,
        newTabName: editTitleValue,
      });
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalShow(true);
  };

  const handleAddUrl = () => {
    if (!inputValue.trim()) return;

    if (communicationType === "http") {
      postUrlsMutation({ tabId: tabId, url: inputValue });
    } else if (communicationType === "websocket" && onWebSocketAction) {
      onWebSocketAction("addUrl", {
        tabId: tabId,
        url: inputValue,
      });
    }
    setInputValue("");
  };

  const modalPosition = () => {
    if (iconRef.current) {
      const iconReact = iconRef.current.getBoundingClientRect();
      return {
        left: `${iconReact.right - 350}px`,
      };
    }
    return { left: "0px" };
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalShow && !modalRef.current?.contains(target)) {
        setModalShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalShow]);

  const clickSaveTabs = async () => {
    console.log("🔍 clickSaveTabs 함수 호출됨", {
      communicationType,
      spaceId,
      extensionId,
    });

    if (communicationType === "http") {
      console.log("📝 개인스페이스 - handleSaveTabs 호출");
      handleSaveTabs();
    } else {
      console.log("👥 팀스페이스 - Extension을 통한 탭 가져오기");
      // 팀스페이스에서는 확장프로그램을 통해 탭을 가져와서 웹소켓으로 저장
      try {
        const jwtToken = localStorage.getItem("accessToken");
        console.log("🔑 JWT 토큰 확인:", jwtToken ? "존재함" : "없음");

        if (!jwtToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        console.log("🔍 Chrome Extension 체크:", {
          chrome: !!window.chrome,
          runtime: !!window.chrome?.runtime,
          extensionId: extensionId,
        });

        if (!window.chrome?.runtime) {
          throw new Error("Chrome Extension이 설치되지 않았습니다.");
        }

        if (!extensionId) {
          throw new Error("Extension ID를 찾을 수 없습니다.");
        }

        console.log("📤 Extension에 SAVE_TABS 요청 전송");

        // useExtension의 sendMessageToExtension 함수 사용
        const response = await sendMessageToExtension({
          action: "SAVE_TABS",
          token: jwtToken,
        });

        console.log("📥 Extension 응답:", response);

        // 응답에서 URL들 추출
        const urls = response?.data?.result?.urls;
        console.log("📋 가져온 URL들:", urls);

        if (urls && urls.length === 0) {
          alert("저장할 탭이 없습니다.");
          return;
        }

        console.log("🔗 웹소켓 설정:", {
          communicationType,
          hasOnWebSocketAction: !!onWebSocketAction,
          tabId,
        });

        let savedCount = 0;

        for (const url of urls || []) {
          console.log("🔄 URL 처리 중:", url);

          if (communicationType === "websocket" && onWebSocketAction && url) {
            console.log("📤 웹소켓으로 URL 저장:", {
              action: "addUrl",
              tabId,
              url: url,
            });

            onWebSocketAction("addUrl", {
              tabId: tabId,
              url: url,
            });
            savedCount++;
          } else {
            console.log("⏭️ URL 건너뜀:", {
              communicationType,
              hasOnWebSocketAction: !!onWebSocketAction,
              hasUrl: !!url,
            });
          }
        }

        console.log(`✅ 총 ${savedCount}개의 URL이 저장됨`);
        alert(`✅ ${savedCount}개의 URL이 팀스페이스에 저장되었습니다!`);
      } catch (error) {
        console.error("탭 저장 실패:", error);
        alert(
          `❌ 저장 실패: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="flex flex-col gap-5 w-full min-h-[225px] p-[24px] bg-white border border-[#E0E0E0] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]"
      draggable
      onDragStart={(e) => dragStart(e, index)}
      onDragEnter={(e) => dragEnter(e, index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={drop}
    >
      <div className="flex gap-4 h-[52px] items-center justify-between">
        <div className="flex gap-5 items-center relative">
          {editTitle ? (
            <input
              className="text-2xl border-none focus:outline-none"
              value={editTitleValue}
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleSubmit();
                }
              }}
              onBlur={() => setEditTitle(false)}
            />
          ) : (
            <p className="text-2xl" onClick={() => setEditTitle(true)}>
              {title}
            </p>
          )}

          <button
            className="bg-transparent border-none cursor-pointer "
            onClick={handleIconClick}
            ref={iconRef}
          >
            <Icon name="Vector" />
          </button>
          {modalShow && (
            <div
              className="absolute top-[-10px]"
              ref={modalRef}
              style={modalPosition()}
            >
              <URLsModal
                tabId={tabId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onWebSocketAction={onWebSocketAction}
                communicationType={communicationType}
              />
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button
            colorType="sub"
            iconName="add_circle"
            onClick={() => setShowInput(true)}
          />
          <Button colorType="sub" onClick={clickSaveTabs}>
            Save Tabs
          </Button>
          <Button colorType="sub" onClick={() => handleOpenTabsById()}>
            Open Links
          </Button>
        </div>
      </div>
      <p className="text-[#828282] text-[16px] font-semibold">Source</p>
      <div className="flex flex-col">
        {(urls.length === 0 || showInput) && (
          <Url
            state="input"
            value={inputValue}
            onChange={handleInputChange}
            onCancel={() => setShowInput(false)}
            tabId={tabId}
            onAdd={handleAddUrl}
            communicationType={communicationType}
            onWebSocketAction={onWebSocketAction}
          />
        )}

        {urls.slice(0, showAll ? urls.length : 2).map((url: TUrl) => (
          <Url
            key={url.urlItemId}
            state="url"
            text={url.url}
            tabId={tabId}
            urlItemId={url.urlItemId}
            communicationType={communicationType}
            onWebSocketAction={onWebSocketAction}
          />
        ))}
        {urls.length > 2 && (
          <button
            className="flex items-center justify-center cursor-pointer"
            onClick={handleShowAll}
          >
            <Icon name={showAll ? "Chevron_Up_Duo" : "Chevron_Down_Duo"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default URLs;
