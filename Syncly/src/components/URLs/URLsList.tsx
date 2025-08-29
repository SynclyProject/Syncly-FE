//import URLsListData from "../../shared/api/mock/URLsList";
import { TMySpaceURLs } from "../../shared/type/mySpaceType";
import URLsInput from "./URLsInput";
import URLs from "./URLs";
import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { useQuery } from "@tanstack/react-query";
import { GetAllTaps } from "../../shared/api/URL/getList";
import { useLocation, useParams } from "react-router-dom";

interface IURLsListProps {
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

const URLsList = ({ showInput, setShowInput }: IURLsListProps) => {
  const { personalSpaceId, setWorkspaceId } = useWorkSpaceContext();
  const location = useLocation();
  const { id } = useParams();
  setWorkspaceId(Number(id));

  let spaceId: number;

  if (location.pathname === "/my-urls") {
    spaceId = personalSpaceId;
  } else {
    spaceId = Number(id);
  }

  const { data: urlsTapList } = useQuery({
    queryKey: ["urlsTapList", spaceId],
    queryFn: () => GetAllTaps({ workspaceId: spaceId }),
  });
  console.log("urlsTapList : ", urlsTapList);

  // 데이터가 없거나 taps가 undefined인 경우 안전하게 처리
  const taps = urlsTapList?.result?.taps || [];
  const hasTaps = taps.length > 0;

  return (
    <div className="flex flex-col gap-5 w-full">
      {!hasTaps && <URLsInput onCancel={() => setShowInput(false)} />}
      {showInput && <URLsInput onCancel={() => setShowInput(false)} />}

      {hasTaps && (
        <div className="flex flex-col gap-5 w-full">
          {taps.map((urls: TMySpaceURLs) => (
            <URLs
              key={urls.tapId}
              title={urls.tapName}
              urls={urls.urls}
              urlsId={urls.tapId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default URLsList;
