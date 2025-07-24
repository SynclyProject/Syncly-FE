import { chatData } from "../../shared/api/mock/ChatData";
import Chat from "./Chat";
import dayjs from "dayjs";

const Chatting = () => {
  return (
    <div className="max-w-[350px] min-w-[140px] w-full h-full flex flex-col gap-3">
      {chatData.map((chat) => {
        const prevChat = chatData[chat.id - 1];
        let showTime = true;

        if (prevChat && prevChat.who === chat.who) {
          const prevTime = dayjs(prevChat.time);
          const currentTime = dayjs(chat.time);
          showTime = currentTime.diff(prevTime, "day") > 5;
        }
        if (prevChat && prevChat.who === chat.who && !showTime) {
          return <Chat key={chat.id} {...chat} hideTime />;
        }
        return <Chat key={chat.id} {...chat} />;
      })}
    </div>
  );
};

export default Chatting;
