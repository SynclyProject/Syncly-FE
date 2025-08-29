import { useState } from "react";
import Button from "../../shared/ui/Button";
import Url from "./Url";
import { TMySpaceURLs, TUrl } from "../../shared/type/mySpaceType";
import { useMutation } from "@tanstack/react-query";
import { PostTaps } from "../../shared/api/URL/personal";

interface IURLsInputProps {
  onAdd?: (urls: TMySpaceURLs) => void;
  onCancel: () => void;
  initialValue?: string;
}

const URLsInput = ({ onAdd, onCancel, initialValue = "" }: IURLsInputProps) => {
  const [title, setTitle] = useState(initialValue);
  const [urls, setUrls] = useState<TUrl[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  const { mutate: postTapsMutation } = useMutation({
    mutationFn: PostTaps,
    onSuccess: (data) => {
      console.log("탭 생성 성공", data);
    },
  });

  const handleAddUrl = () => {
    if (currentUrl.trim()) {
      const newUrl: TUrl = {
        urlItemId: urls.length + 1, // 임시 ID 생성
        url: currentUrl,
        createdAt: new Date().toISOString(),
      };
      setUrls([...urls, newUrl]);
      setCurrentUrl("");
    }
  };

  const handleUrlChange = (value: string) => {
    setCurrentUrl(value);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    postTapsMutation({ urlTapName: title });

    // 상태 초기화
    setTitle("");
    setUrls([]);
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
        />
        {urls.map((url: TUrl) => (
          <Url key={url.urlItemId} state="url" text={url.url} />
        ))}
      </div>
    </div>
  );
};

export default URLsInput;
