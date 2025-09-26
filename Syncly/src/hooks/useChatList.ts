import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetChatList, GetWorkspaceMemberId } from "../shared/api/Chat";

export const useChatList = () => {
  const { id } = useParams();
  const spaceId = Number(id);

  const { data: myId } = useQuery({
    queryKey: ["myId", spaceId],
    queryFn: () => GetWorkspaceMemberId(spaceId),
  });

  const { data: chatList, refetch } = useQuery({
    queryKey: ["chatList", spaceId],
    queryFn: () => GetChatList({ workspaceId: spaceId }),
  });

  return {
    chatList,
    refetch,
    myId,
  };
};
