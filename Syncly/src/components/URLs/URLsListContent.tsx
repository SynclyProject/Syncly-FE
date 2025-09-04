import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import URLsInput from "./URLsInput";
import URLs from "./URLs";
import useDragDrop from "../../hooks/useDragDrop";

interface IURLsListContentProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
  urlsTapList: TMySpaceURLs[];
  communicationType?: "http" | "websocket";
  workspaceId?: number;
  onWebSocketAction?: (action: string, data: Record<string, unknown>) => void;
  isConnected?: boolean;
  subscribeToTab?: (
    tabId: number,
    callback: (message: TMySpaceURLs) => void
  ) => void;
  unsubscribeFromTab?: (tabId: number) => void;
}

const URLsListContent = ({
  showInput,
  setShowInput,
  urlsTapList,
  communicationType = "http",
  workspaceId,
  onWebSocketAction,
  isConnected,
  subscribeToTab,
  unsubscribeFromTab,
}: IURLsListContentProps) => {
  const tabs = urlsTapList || [];
  const hasTabs = tabs.length > 0;

  const { dragStart, dragEnter, drop, list } = useDragDrop({
    urlTapList: tabs,
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {!hasTabs && (
        <URLsInput
          onCancel={() => setShowInput(false)}
          communicationType={communicationType}
          workspaceId={workspaceId}
          onWebSocketAction={onWebSocketAction}
        />
      )}
      {showInput && (
        <URLsInput
          onCancel={() => setShowInput(false)}
          communicationType={communicationType}
          workspaceId={workspaceId}
          onWebSocketAction={onWebSocketAction}
        />
      )}

      {hasTabs && (
        <div className="flex flex-col gap-5 w-full">
          {(list as TMySpaceURLs[]).map((urls, index) => (
            <URLs
              key={urls.tabId}
              title={urls.tabName}
              urls={urls.urls}
              tabId={urls.tabId}
              index={index}
              dragStart={dragStart}
              dragEnter={dragEnter}
              drop={drop}
              communicationType={communicationType}
              onWebSocketAction={onWebSocketAction}
              isConnected={!!isConnected}
              subscribeToTab={
                subscribeToTab as (
                  tabId: number,
                  callback: (message: TMySpaceURLs) => void
                ) => void
              }
              unsubscribeFromTab={unsubscribeFromTab as (tabId: number) => void}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default URLsListContent;
