import { TChatList } from "./chat";
import { TMySpaceURLs } from "./mySpaceType";

export interface WebSocketMessage {
  workspaceId?: number;
  urlTabName?: string;
  urlTabId?: number;
  tabId?: number;
  newUrlTabName?: string;
  url?: string;
  urlItemId?: number;
}

export interface UseWebSocketReturn {
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
  addUrl: (urlTabId: number, url: string) => void;
  deleteUrl: (urlTabId: number, urlItemId: number) => void;
  subscribeToWorkspace: (
    workspaceId: number,
    callback: (message: TMySpaceURLs) => void
  ) => void;
  subscribeToTab: (
    tabId: number,
    callback: (message: TMySpaceURLs) => void
  ) => void;
  unsubscribeFromTab: (tabId: number) => void;
  subscribeToChat: (
    workspaceId: number,
    callback: (message: TChatList) => void
  ) => void;
  sendChat: (workspaceId: number, message: string) => void;
}
