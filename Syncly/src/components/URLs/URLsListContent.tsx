import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import URLsInput from "./URLsInput";
import URLs from "./URLs";
import useDragDrop from "../../hooks/useDragDrop";

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

  const { dragStart, dragEnter, drop, list } = useDragDrop({
    urlTapList: tabs,
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {!hasTabs && <URLsInput onCancel={() => setShowInput(false)} />}
      {showInput && <URLsInput onCancel={() => setShowInput(false)} />}

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default URLsListContent;
