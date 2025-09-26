import { useChatList } from "../../hooks/useChatList";
import Chat from "./Chat";
import { TChat } from "../../shared/type/chat";
import dayjs from "dayjs";

const Chatting = () => {
  const { chatList, myId } = useChatList();

  return (
    <div className="max-w-[350px] min-w-[140px] w-full h-full flex flex-col gap-3">
      {chatList?.result?.items?.map((chat: TChat) => {
        const prevChat = chatList?.result?.items[chat.id - 2];

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
