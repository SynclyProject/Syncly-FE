import Icon from "../../shared/ui/Icon";
import { TUrl } from "../../shared/type/mySpaceType";

type TUrlStateProps = {
  state: "input" | "url";
};

interface IUrlProps extends TUrlStateProps {
  text?: string;
  value?: string;
  onChange?: (value: string) => void;
  onAdd?: (url: string) => void;
  onCancel?: () => void;
  id?: number;
  setUrlList?: React.Dispatch<React.SetStateAction<TUrl[]>>;
}

const Url = ({
  state,
  text,
  value,
  onChange,
  onAdd,
  onCancel,
  id,
  setUrlList,
}: IUrlProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onAdd) {
      onAdd(value || "");
    }
  };
  const handleBlur = () => {
    if (!value?.trim()) onCancel?.();
  };

  return (
    <div className="flex w-full h-[48px] px-[5px] items-center bg-white border-t border-t-[#E0E0E0] gap-2">
      <Icon name="url" />
      {state === "input" ? (
        <>
          <input
            className="flex-1 font-medium focus:outline-none"
            placeholder="Enter a link..."
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          <Icon name="plus_blue" onClick={() => onAdd?.(value || "")} />
        </>
      ) : (
        <>
          <p className="flex-1 text-[16px] font-semibold">{text}</p>
          <button
            className="cursor-pointer"
            onClick={() => {
              if (setUrlList) {
                setUrlList((prev) => prev.filter((url) => url.id !== id));
              }
            }}
          >
            <Icon name="Trash_Full" />
          </button>
        </>
      )}
    </div>
  );
};

export default Url;
