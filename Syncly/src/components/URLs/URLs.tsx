import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import Url from "./Url";
import { useState } from "react";

interface IURLsProps {
  title: string;
  urls: string[];
  onUpdateUrls?: (newUrls: string[]) => void;
}

const URLs = ({ title, urls, onUpdateUrls }: IURLsProps) => {
  const [showInput, setShowInput] = useState(false);
  const [urlList, setUrlList] = useState<string[]>(urls);
  const [inputValue, setInputValue] = useState("");

  const handleAddUrl = (url: string) => {
    if (url.trim()) {
      const newUrlList = [...urlList, url];
      setUrlList(newUrlList);
      onUpdateUrls?.(newUrlList);
      setShowInput(false);
      setInputValue("");
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="flex flex-col gap-5 w-full min-h-[225px] p-[24px] bg-white border border-[#E0E0E0] rounded-[8px] shadow-[shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]">
      <div className="flex gap-4 h-[52px] items-center justify-between">
        <div className="flex gap-5 items-center">
          <p className="text-2xl">{title}</p>
          <Icon name="Vector" />
        </div>
        <div className="flex gap-4">
          <Button
            colorType="sub"
            iconName="add_circle"
            onClick={() => setShowInput(true)}
          />
          <Button colorType="sub">Save Tabs</Button>
          <Button colorType="sub">Open Links</Button>
        </div>
      </div>
      <p className="text-[#828282] text-[16px] font-semibold">Source</p>
      <div className="flex flex-col">
        {showInput && (
          <Url
            state="input"
            value={inputValue}
            onChange={handleInputChange}
            onAdd={handleAddUrl}
            onCancel={() => setShowInput(false)}
          />
        )}
        {urlList.map((url: string, index: number) => (
          <Url key={index} state="url" text={url} />
        ))}
      </div>
    </div>
  );
};

export default URLs;
