import { useParams } from "react-router-dom";
import {
  useQuery,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
  DefaultError,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  GetChatLisBefore,
  GetChatList,
  GetWorkspaceMemberId,
} from "../shared/api/Chat";
import { TChatList } from "../shared/type/chat";

export const useChatList = () => {
  const { id } = useParams();
  const spaceId = Number(id);

  const { data: myId } = useQuery({
    queryKey: ["myId", spaceId],
    queryFn: () => GetWorkspaceMemberId(spaceId),
  });

  const { data: chatList, refetch } = useQuery({
    queryKey: ["chatList", spaceId],
    queryFn: () => GetChatList({ workspaceId: spaceId, limit: 8 }),
  });

  return {
    chatList,
    refetch,
    myId,
  };
};

interface IUseGetInfiniteChatListProps {
  queryOptions?: UseInfiniteQueryOptions<
    TChatList,
    DefaultError,
    InfiniteData<TChatList, number>,
    TChatList,
    QueryKey,
    number
  >;
  beforeSeq: number;
  afterSeq: number;
}

export const useGetInfiniteChatList = ({
  queryOptions,
  beforeSeq,
}: IUseGetInfiniteChatListProps) => {
  const { id } = useParams();
  const spaceId = Number(id);

  return useInfiniteQuery({
    queryKey: ["chatListBefore", spaceId],
    queryFn: ({ pageParam }) =>
      GetChatLisBefore({
        workspaceId: spaceId,
        beforeSeq: pageParam as number,
      }),
    initialPageParam: beforeSeq,
    getNextPageParam: (lastPage: TChatList) =>
      lastPage?.nextBeforeSeq ?? undefined,
    ...queryOptions,
  });
};
