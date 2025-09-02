import URLsListContent from "./URLsListContent";
import { useURLsList } from "../../hooks/useURLsList";

interface IURLsListProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const URLsList = ({ showInput, setShowInput }: IURLsListProps) => {
  const { urlsTapListData } = useURLsList();

  return (
    <div className="flex flex-col gap-5 w-full">
      <URLsListContent
        showInput={showInput}
        setShowInput={setShowInput}
        urlsTapList={urlsTapListData}
      />
    </div>
  );
};

export default URLsList;
