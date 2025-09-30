import { useURLsList } from "../../hooks/useURLsList";
import { DeleteTaps } from "../../shared/api/URL/personal";
import { useMutation } from "@tanstack/react-query";

interface IURLsModalProps {
  tabId: number;
  editTitle: boolean;
  setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
  onWebSocketAction?: (action: string, data: Record<string, unknown>) => void;
  communicationType?: "http" | "websocket";
}

const URLsModal = ({
  tabId,
  editTitle,
  setEditTitle,
  onWebSocketAction,
  communicationType,
}: IURLsModalProps) => {
  const { refetch, spaceId } = useURLsList();

  const { mutate: DeleteTapsMutation } = useMutation({
    mutationFn: DeleteTaps,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDeleteClick = () => {
    if (communicationType === "http") {
      DeleteTapsMutation({ tabId: tabId });
    } else if (communicationType === "websocket" && onWebSocketAction) {
      onWebSocketAction("deleteUrlTab", {
        workspaceId: spaceId,
        urlTabId: tabId,
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 w-[210px] rounded-[8px] bg-white p-4 border border-[#E0E0E0]">
      <p
        className="text-[#828282] cursor-pointer"
        onClick={() => {
          setEditTitle(!editTitle);
        }}
      >
        타이틀 이름 변경
      </p>
      <p className="text-[#F45B69] cursor-pointer" onClick={handleDeleteClick}>
        삭제하기
      </p>
    </div>
  );
};
export default URLsModal;
