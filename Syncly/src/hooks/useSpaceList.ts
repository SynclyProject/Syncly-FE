import { GetSpaceList } from "../shared/api/WorkSpace/get";
import { useQuery } from "@tanstack/react-query";
import { TTeamSpace } from "../shared/type/teamSpaceType";

export const useSpaceList = () => {
  const { data: spaceList, refetch } = useQuery({
    queryFn: GetSpaceList,
    queryKey: ["spaceList"],
  });
  const teamSpaceList = spaceList?.result?.filter(
    (space: TTeamSpace) => space.workspaceType === "TEAM"
  );

  return {
    teamSpaceList,
    refetch,
  };
};
