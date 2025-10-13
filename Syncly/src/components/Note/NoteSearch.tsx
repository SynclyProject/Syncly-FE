import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "../../shared/ui/Button";
import Icon from "../../shared/ui/Icon";

const NoteSearch = ({
  setSearchValue,
  setSort,
  setShowInput,
  showInput,
}: {
  setSearchValue: (value: string) => void;
  setSort: (value: boolean) => void;
  setShowInput: (value: boolean) => void;
  showInput: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("mq") ?? "");
  const [showFilter, setShowFilter] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        showFilter &&
        !modalRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);

  useEffect(() => {
    setSearchParams({ mq: inputValue });
    setSearchValue(inputValue);
  }, [inputValue, setSearchParams, setSearchValue]);

  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="flex flex-col gap-5 mt-5">
      <p
        className="font-medium text-[32px] overflow-hidden overflow-ellipsis cursor-pointer"
        onClick={() => setShowInput(false)}
      >
        Note
      </p>
      <div className="flex items-center gap-[10px] w-full">
        <div className="flex items-center gap-[10px] px-3 py-2 border border-[#E0E0E0] rounded-[8px] bg-white">
          <Icon name="search" />
          <input
            className="w-full outline-none"
            type="text"
            placeholder="Search notes..."
            value={inputValue}
            onChange={onChangeSearchValue}
          />
        </div>
        <div className="relative flex-1">
          <Button
            colorType="white"
            iconName="filter"
            onClick={() => setShowFilter(true)}
          >
            Filter
          </Button>
          {showFilter && (
            <div
              className="absolute bottom-[-105px] left-0 flex flex-col gap-5 rounded-[8px] min-w-[120px] bg-white p-4 border border-[#E0E0E0]"
              ref={modalRef}
            >
              <p
                className="text-[#828282] cursor-pointer"
                onClick={() => setSort(false)}
              >
                최신순
              </p>
              <p
                className="text-[#828282] cursor-pointer"
                onClick={() => setSort(true)}
              >
                가나다순
              </p>
            </div>
          )}
        </div>
        {!showInput && (
          <Button
            colorType="main"
            iconName="add_circle"
            onClick={() => setShowInput(true)}
          />
        )}
      </div>
    </div>
  );
};

export default NoteSearch;
