import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import URLsInput from "./URLsInput";
import URLs from "./URLs";

interface IURLsListContentProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
  urlsTapList: TMySpaceURLs[];
}

const URLsListContent = ({
  showInput,
  setShowInput,
  urlsTapList,
}: IURLsListContentProps) => {
  const tabs = urlsTapList || [];
  const hasTabs = tabs.length > 0;

  return (
    <div className="flex flex-col gap-5 w-full">
      {!hasTabs && <URLsInput onCancel={() => setShowInput(false)} />}
      {showInput && <URLsInput onCancel={() => setShowInput(false)} />}

      {hasTabs && (
        <div className="flex flex-col gap-5 w-full">
          {tabs.map((urls: TMySpaceURLs) => (
            <URLs
              key={urls.tabId}
              title={urls.tabName}
              urls={urls.urls}
              tabId={urls.tabId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default URLsListContent;
