import { useState } from "react";
import Button from "../../shared/ui/Button";
import Url from "./Url";
import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import { useMutation } from "@tanstack/react-query";
import { PostTabItems, PostTaps } from "../../shared/api/URL/personal";
import { useURLsList } from "../../hooks/useURLsList";

interface IURLsInputProps {
  onAdd?: (urls: TMySpaceURLs) => void;
  onCancel: () => void;
  initialValue?: string;
  communicationType?: "http" | "websocket"; // 통신 방식 지정
  workspaceId?: number; // 웹소켓 사용 시 필요
  onWebSocketAction?: (action: string, data: Record<string, unknown>) => void; // 웹소켓 액션 콜백
}

let tabId: number;

const URLsInput = ({
  onCancel,
  initialValue = "",
  communicationType = "http",
  workspaceId,
  onWebSocketAction,
}: IURLsInputProps) => {
  const [title, setTitle] = useState(initialValue);
  const [currentUrl, setCurrentUrl] = useState("");

  const { refetch } = useURLsList();

  // HTTP 통신을 위한 mutation
  const { mutate: postTapsMutation } = useMutation({
    mutationFn: PostTaps,
    onSuccess: (data) => {
      tabId = data.result.urlTabId;
      refetch();
    },
  });

  const { mutate: postUrlsMutation } = useMutation({
    mutationFn: PostTabItems,
    onSuccess: () => {
      refetch();
    },
  });

  const handleAddUrl = () => {
    if (currentUrl.trim()) {
      if (communicationType === "http") {
        postUrlsMutation({ tabId: tabId, url: currentUrl });
      } else if (
        communicationType === "websocket" &&
        workspaceId &&
        onWebSocketAction
      ) {
        // 웹소켓을 통한 URL 추가
        onWebSocketAction("addUrl", {
          workspaceId,
          urlTabId: tabId,
          url: currentUrl,
        });
      }
      setCurrentUrl("");
    }
  };

  const handleUrlChange = (value: string) => {
    setCurrentUrl(value);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (communicationType === "http") {
      postTapsMutation({ urlTabName: title });
    } else if (
      communicationType === "websocket" &&
      workspaceId &&
      onWebSocketAction
    ) {
      // 웹소켓을 통한 탭 생성
      onWebSocketAction("createUrlTab", {
        workspaceId,
        urlTabName: title,
      });
    }

    // 상태 초기화
    setTitle("");
    setCurrentUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleBlur = () => {
    if (!title.trim()) onCancel();
  };

  return (
    <div className="flex flex-col gap-5 w-full min-h-[225px] p-[24px] bg-white border border-[#E0E0E0] rounded-[8px] shadow-[shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]">
      <div className="flex gap-4 h-[52px] items-center ">
        <input
          className="flex-1 text-2xl focus:outline-none"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <Button colorType="sub" iconName="add_circle" onClick={handleAddUrl} />
        <Button colorType="sub">Save Tabs</Button>
        <Button colorType="sub">Open Links</Button>
      </div>
      <p className="text-[#828282] text-[16px] font-semibold">Source</p>
      <div className="flex flex-col">
        <Url
          state="input"
          value={currentUrl}
          onChange={handleUrlChange}
          onAdd={handleAddUrl}
          tabId={tabId}
        />
        {/* {urls.map((url: TUrl) => (
          <Url key={url.urlItemId} state="url" text={url.url} tabId={tabId} />
        ))} */}
      </div>
    </div>
  );
};

export default URLsInput;
