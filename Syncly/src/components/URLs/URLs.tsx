import Button from "../../shared/ui/Button";
import Url from "./Url";
import { useState } from "react";

interface IURLsProps {
  title: string;
  urls: string[];
}

const URLs = ({ title, urls }: IURLsProps) => {
  const [showInput, setShowInput] = useState(false);
  const [urlList, setUrlList] = useState<string[]>([]);

  const handleAddUrl = (url: string) => {
    setUrlList([...urlList, url]);
    setShowInput(false);
  };

  return (
    <div className="flex flex-col gap-5 w-full min-h-[225px] p-[24px] bg-white border border-[#E0E0E0] rounded-[8px] shadow-[shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]">
      <div className="flex gap-4 h-[52px] items-center ">
        <p className="flex-1 text-2xl">{title}</p>
        <Button
          colorType="sub"
          iconName="add_circle"
          onClick={() => setShowInput(true)}
        />
        <Button colorType="sub">Save Tabs</Button>
        <Button colorType="sub">Open Links</Button>
      </div>
      <p className="text-[#828282] text-[16px] font-semibold">Source</p>
      <div className="flex flex-col">
        {showInput && (
          <Url
            state="input"
            onAdd={handleAddUrl}
            onCancel={() => setShowInput(false)}
          />
        )}
        {urls && urls.map((url: string) => <Url state="url" text={url} />)}
      </div>
    </div>
  );
};

export default URLs;
