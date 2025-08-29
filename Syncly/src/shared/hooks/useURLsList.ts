import { useWorkSpaceContext } from "../../context/workSpaceContext";
import { useQuery } from "@tanstack/react-query";
import { GetAllTaps } from "../../shared/api/URL/getList";
import { useLocation, useParams } from "react-router-dom";

export const useURLsList = () => {
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

  const {
    data: urlsTapList,
    refetch,
    error,
  } = useQuery({
    queryKey: ["urlsTapList", spaceId],
    queryFn: () => GetAllTaps({ workspaceId: spaceId }),
  });

  const urlsTapListData = urlsTapList?.result?.tabs || [];

  return {
    spaceId,
    urlsTapListData,
    refetch,
    error,
    isPersonalPage: location.pathname === "/my-urls",
  };
};
