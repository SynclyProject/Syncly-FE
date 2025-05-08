import URLsListData from "../../shared/api/mock/URLsList";
import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import { useState } from "react";
import URLsInput from "./URLsInput";
import URLs from "./URLs";

interface IURLsListProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const URLsList = ({ showInput, setShowInput }: IURLsListProps) => {
  const [urlsList, setUrlsList] = useState<TMySpaceURLs[]>(URLsListData);

  const handleAddUrls = (urls: TMySpaceURLs) => {
    if (!urls.title.trim()) return;
    const newUrls: TMySpaceURLs = {
      id: urlsList.length + 1,
      title: urls.title,
      urls: urls.urls,
    };
    setUrlsList((prev) => [...prev, newUrls]);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {!urlsList && (
        <URLsInput onAdd={handleAddUrls} onCancel={() => setShowInput(false)} />
      )}
      {showInput && (
        <URLsInput onAdd={handleAddUrls} onCancel={() => setShowInput(false)} />
      )}

      {urlsList && (
        <div className="flex flex-col gap-5 w-full">
          {urlsList.map((urls: TMySpaceURLs) => (
            <URLs key={urls.id} title={urls.title} urls={urls.urls} />
          ))}
        </div>
      )}
    </div>
  );
};

export default URLsList;
