import { DeleteTaps } from "../../shared/api/URL/personal";

interface IURLsModalProps {
  tabId: number;
  editTitle: boolean;
  setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
}

const URLsModal = ({ tabId, editTitle, setEditTitle }: IURLsModalProps) => {
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
      <p
        className="text-[#F45B69] cursor-pointer"
        onClick={() => {
          DeleteTaps({ tabId: tabId });
          window.location.reload();
        }}
      >
        삭제하기
      </p>
    </div>
  );
};
export default URLsModal;
