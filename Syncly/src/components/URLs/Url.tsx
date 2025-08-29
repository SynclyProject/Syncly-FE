import Icon from "../../shared/ui/Icon";
import { useMutation } from "@tanstack/react-query";
import { DeleteTabItems } from "../../shared/api/URL/personal";
import { useURLsList } from "../../shared/hooks/useURLsList";

type TUrlStateProps = {
  state: "input" | "url";
};

interface IUrlProps extends TUrlStateProps {
  text?: string;
  value?: string;
  onChange?: (value: string) => void;
  onAdd?: (url: string) => void;
  onCancel?: () => void;
  tabId: number;
  urlItemId?: number;
}

const Url = ({
  state,
  text,
  value,
  onChange,
  onAdd,
  onCancel,
  tabId,
  urlItemId,
}: IUrlProps) => {
  const { refetch } = useURLsList();

  const { mutate: deleteTabItemsMutation } = useMutation({
    mutationFn: DeleteTabItems,
    onSuccess: () => {
      refetch();
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value?.trim()) {
      onAdd?.(value);
      refetch();
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
              if (urlItemId) {
                deleteTabItemsMutation({ tabId: tabId, itemId: urlItemId });
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
