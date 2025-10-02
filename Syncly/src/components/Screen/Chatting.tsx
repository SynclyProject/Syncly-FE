import { useChatList, useGetInfiniteChatList } from "../../hooks/useChatList";
import Chat from "./Chat";
import { TChat, TChatList } from "../../shared/type/chat";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

const Chatting = () => {
  const { chatList, myId } = useChatList();
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
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

    // 모든 메시지를 합치고 중복 제거 (id 기준)
    const allMessages = [...older, ...latest];
    const uniqueMessages = allMessages.filter(
      (message, index, array) =>
        array.findIndex((m) => m.id === message.id) === index
    );

    // seq 기준으로 정렬 (오래된 순서대로)
    return uniqueMessages.sort((a, b) => a.seq - b.seq);
  }, [beforePages, chatList]);

  // 무한 스크롤을 위한 Intersection Observer
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

  // 스크롤 위치 추적
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10; // 10px 여유
      setIsUserAtBottom(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // 새 메시지가 추가될 때 사용자가 맨 아래에 있을 때만 자동 스크롤
  useEffect(() => {
    if (bottomRef.current && isUserAtBottom) {
      // 즉시 스크롤 (애니메이션 없이)
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [items.length, isUserAtBottom]); // items 배열의 길이가 변경될 때마다 실행

  return (
    <div
      ref={chatContainerRef}
      className="max-w-[350px] min-w-[140px] w-full flex flex-col gap-3 overflow-y-auto pl-[20px] border-l-[1px] border-[#E0E0E0]
                 h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh]
                 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] lg:max-h-[700px] xl:max-h-full
                 min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
    >
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
      <div ref={bottomRef} />
    </div>
  );
};

export default Chatting;
