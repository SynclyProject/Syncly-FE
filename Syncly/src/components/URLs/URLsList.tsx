import URLsListContent from "./URLsListContent";
import { useURLsList } from "../../shared/hooks/useURLsList";

interface IURLsListProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const URLsList = ({ showInput, setShowInput }: IURLsListProps) => {
  const { urlsTapListData } = useURLsList();

  return (
    <URLsListContent
      showInput={showInput}
      setShowInput={setShowInput}
      urlsTapList={urlsTapListData}
    />
  );
};

export default URLsList;
