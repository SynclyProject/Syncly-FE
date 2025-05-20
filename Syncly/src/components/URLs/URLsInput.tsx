import { useState } from "react";
import Button from "../../shared/ui/Button";
import Url from "./Url";
import { TMySpaceURLs, TUrl } from "../../shared/type/mySpaceType";

interface IURLsInputProps {
  onAdd: (urls: TMySpaceURLs) => void;
  onCancel: () => void;
}

const URLsInput = ({ onAdd, onCancel }: IURLsInputProps) => {
  const [title, setTitle] = useState("");
  const [urls, setUrls] = useState<TUrl[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  const handleAddUrl = () => {
    if (currentUrl.trim()) {
      const newUrl: TUrl = {
        id: urls.length + 1, // 임시 ID 생성
        url: [currentUrl],
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
    const newUrls: TMySpaceURLs = {
      id: urls.length + 1, // 임시 ID 생성
      title: title,
      urls: urls,
    };
    onAdd(newUrls);
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
        {urls.map((url) => (
          <Url key={url.id} state="url" text={url.url[0]} />
        ))}
      </div>
    </div>
  );
};

export default URLsInput;
