import { useChatList, useGetInfiniteChatList } from "../../hooks/useChatList";
import Chat from "./Chat";
import { TChat, TChatList } from "../../shared/type/chat";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef } from "react";

const Chatting = () => {
  const { chatList, myId } = useChatList();
  const topRef = useRef<HTMLDivElement | null>(null);
  const nextBeforeSeq = chatList?.result?.nextBeforeSeq;

  const {
    data: beforePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteChatList({
    beforeSeq: nextBeforeSeq ?? 0,
    afterSeq: 0,
    queryOptions: {
      enabled: !!nextBeforeSeq,
      staleTime: 0,
      queryKey: ["chatListBefore", nextBeforeSeq],
      getNextPageParam: (lastPage: TChatList) =>
        lastPage?.nextBeforeSeq ?? undefined,
      initialPageParam: nextBeforeSeq ?? 0,
    },
  });

  const items = useMemo(() => {
    const older = beforePages ? beforePages.pages.flatMap((p) => p.items) : [];
    const latest = chatList?.result?.items ?? [];
    return [...older, ...latest];
  }, [beforePages, chatList]);

  useEffect(() => {
    if (!topRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.01 }
    );
    io.observe(topRef.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-[350px] min-w-[140px] w-full h-full flex flex-col gap-3 overflow-y-auto">
      <div ref={topRef} />
      {items.map((chat: TChat, index: number) => {
        const prevChat = index > 0 ? items[index - 1] : undefined;

        let showTime = true;
        let showDate = true;
        const sendDate = chat.createdAt.split("T")[0];
        const sendTime = chat.createdAt.split("T")[1].split(".")[0].slice(0, 5);

        if (prevChat) {
          const prevTime = dayjs(prevChat.createdAt);
          const currentTime = dayjs(chat.createdAt);

          // 날짜가 다르면 날짜 표시
          showDate = !currentTime.isSame(prevTime, "day");

          // 같은 사람이 연속으로 보낸 메시지인 경우
          if (prevChat.senderId === chat.senderId) {
            // 5분 이상 차이나면 시간 표시
            showTime = currentTime.diff(prevTime, "minute") >= 5;
          } else {
            // 다른 사람의 메시지면 시간 표시
            showTime = true;
          }
        }

        if (
          prevChat &&
          prevChat.senderId === chat.senderId &&
          !showTime &&
          !showDate
        ) {
          return (
            <Chat
              key={chat.id}
              who={chat.senderId === myId?.result ? "me" : "other"}
              profile={chat.senderProfileImage}
              name={chat.senderName}
              message={chat.content}
              date={sendDate}
              time={sendTime}
              hideTime={true}
              hideDate={true}
            />
          );
        }

        if (prevChat && prevChat.senderId === chat.senderId && !showTime) {
          return (
            <Chat
              key={chat.id}
              who={chat.senderId === myId?.result ? "me" : "other"}
              profile={chat.senderProfileImage}
              name={chat.senderName}
              message={chat.content}
              date={sendDate}
              time={sendTime}
              hideTime={true}
              hideDate={!showDate}
            />
          );
        }

        return (
          <Chat
            key={chat.id}
            who={chat.senderId === myId?.result ? "me" : "other"}
            profile={chat.senderProfileImage}
            name={chat.senderName}
            message={chat.content}
            date={sendDate}
            time={sendTime}
            hideDate={!showDate}
          />
        );
      })}
    </div>
  );
};

export default Chatting;
