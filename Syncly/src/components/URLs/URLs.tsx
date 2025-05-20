import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import Url from "./Url";
import URLsModal from "./URLsModal";
import { TMySpaceURLs, TUrl } from "../../shared/type/mySpaceType";
import { useState, useRef, useEffect } from "react";

interface IURLsProps {
  title: string;
  urls: TUrl[];
  urlsId: number;
  setURLs: React.Dispatch<React.SetStateAction<TMySpaceURLs[]>>;
  onUpdateUrls?: (newUrls: TUrl[]) => void;
}

const URLs = ({ title, urls, onUpdateUrls, urlsId, setURLs }: IURLsProps) => {
  const [showInput, setShowInput] = useState(false);
  const [urlList, setUrlList] = useState<TUrl[]>(urls);
  const [inputValue, setInputValue] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(title);
  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

  const handleAddUrl = (url: string) => {
    if (url.trim()) {
      const newUrlList = [...urlList, { id: urlList.length + 1, url: [url] }];
      setUrlList(newUrlList);
      onUpdateUrls?.(newUrlList);
      setShowInput(false);
      setInputValue("");
    }
  };
  const handleTitleChange = (value: string) => {
    setEditTitleValue(value);
  };
  const handleTitleSubmit = () => {
    if (!editTitleValue.trim()) return;
    setURLs((prev) =>
      prev.map((url) =>
        url.id === urlsId ? { ...url, title: editTitleValue } : url
      )
    );
    setEditTitle(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalShow(true);
  };

  const modalPosition = () => {
    if (iconRef.current) {
      const iconReact = iconRef.current.getBoundingClientRect();
      return {
        left: `${iconReact.right - 350}px`,
      };
    }
    return { left: "0px" };
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (modalShow && !modalRef.current?.contains(target)) {
        setModalShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalShow]);

  return (
    <div className="flex flex-col gap-5 w-full min-h-[225px] p-[24px] bg-white border border-[#E0E0E0] rounded-[8px] shadow-[shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]">
      <div className="flex gap-4 h-[52px] items-center justify-between">
        <div className="flex gap-5 items-center relative">
          {editTitle ? (
            <input
              className="text-2xl border-none focus:outline-none"
              value={editTitleValue}
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleSubmit();
                }
              }}
              onBlur={() => setEditTitle(false)}
            />
          ) : (
            <p className="text-2xl" onClick={() => setEditTitle(true)}>
              {title}
            </p>
          )}

          <button
            className="bg-transparent border-none cursor-pointer "
            onClick={handleIconClick}
            ref={iconRef}
          >
            <Icon name="Vector" />
          </button>
          {modalShow && (
            <div
              className="absolute top-[-10px]"
              ref={modalRef}
              style={modalPosition()}
            >
              <URLsModal
                urlsId={urlsId}
                setURLs={setURLs}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
              />
            </div>
          )}
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
        {(urlList.length === 0 || showInput) && (
          <Url
            state="input"
            value={inputValue}
            onChange={handleInputChange}
            onAdd={handleAddUrl}
            onCancel={() => setShowInput(false)}
          />
        )}

        {urlList.slice(0, showAll ? urlList.length : 2).map((url: TUrl) => (
          <Url
            key={url.id}
            state="url"
            text={url.url[0]}
            id={url.id}
            setUrlList={setUrlList}
          />
        ))}
        {urlList.length > 2 && (
          <button
            className="flex items-center justify-center cursor-pointer"
            onClick={handleShowAll}
          >
            <Icon name={showAll ? "Chevron_Up_Duo" : "Chevron_Down_Duo"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default URLs;
