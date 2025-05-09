import { TMySpaceURLs } from "../../shared/type/mySpaceType";

interface IURLsModalProps {
  urlsId: number;
  setURLs: React.Dispatch<React.SetStateAction<TMySpaceURLs[]>>;
}

const URLsModal = ({ urlsId, setURLs }: IURLsModalProps) => {
  return (
    <div className="flex flex-col gap-5 w-[210px] rounded-[8px] bg-white p-4 border border-[#E0E0E0]">
      <p className="text-[##828282]">타이틀 이름 변경</p>
      <p
        className="text-[#F45B69] cursor-pointer"
        onClick={() => {
          setURLs((prev) => prev.filter((url) => url.id !== urlsId));
        }}
      >
        삭제하기
      </p>
    </div>
  );
};
export default URLsModal;
