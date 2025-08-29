import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";
import Url from "./Url";
import URLsModal from "./URLsModal";
import { TUrl } from "../../shared/type/mySpaceType";
import { useState, useRef, useEffect } from "react";
import { PatchTaps, PostTabItems } from "../../shared/api/URL/personal";
import { useMutation } from "@tanstack/react-query";
import { useURLsList } from "../../shared/hooks/useURLsList";

interface IURLsProps {
  title: string;
  urls: TUrl[];
  tabId: number;
}

const URLs = ({ title, urls, tabId }: IURLsProps) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(title);

  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

  const { refetch } = useURLsList();

  const { mutate: patchTapsMutation } = useMutation({
    mutationFn: PatchTaps,
    onSuccess: () => {
      setEditTitle(false);
      refetch();
    },
  });

  const { mutate: postUrlsMutation } = useMutation({
    mutationFn: PostTabItems,
    onSuccess: () => {
      refetch();
    },
  });

  const handleTitleChange = (value: string) => {
    setEditTitleValue(value);
  };
  const handleTitleSubmit = () => {
    if (!editTitleValue.trim()) return;
    patchTapsMutation({ tabId: tabId, urlTabName: editTitleValue });
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

  const handleAddUrl = () => {
    postUrlsMutation({ tabId: tabId, url: inputValue });
    setInputValue("");
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
                tabId={tabId}
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
        {(urls.length === 0 || showInput) && (
          <Url
            state="input"
            value={inputValue}
            onChange={handleInputChange}
            onCancel={() => setShowInput(false)}
            tabId={tabId}
            onAdd={handleAddUrl}
          />
        )}

        {urls.slice(0, showAll ? urls.length : 2).map((url: TUrl) => (
          <Url
            key={url.urlItemId}
            state="url"
            text={url.url}
            tabId={tabId}
            urlItemId={url.urlItemId}
          />
        ))}
        {urls.length > 2 && (
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
