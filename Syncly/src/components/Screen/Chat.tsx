import Icon from "../../shared/ui/Icon";

interface IChatProps {
  who: "me" | "other";
  profile: string;
  name: string;
  message: string;
  time: string;
  hideTime?: boolean;
}

const Chat = ({ who, profile, name, message, time, hideTime }: IChatProps) => {
  return (
    <div className="flex flex-col gap-2">
      {!hideTime && (
        <p className="text-sm text-[#828282] text-center">{time}</p>
      )}
      {who === "me" ? (
        <div className="flex flex-col gap-2 items-end">
          <p className="text-xs text-white max-w-[200px] flex gap-2 justify-center items-center px-4 py-3 bg-[#456990] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[4px] rounded-bl-[16px]">
            {message}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-start">
          <div className="flex gap-2 items-center">
            <Icon name={profile} rounded={true} />
            <p className="text-sm text-[#828282]">{name}</p>
          </div>
          <p className="max-w-[200px] text-sm rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4px] bg-[#E0E0E0] px-4 py-3">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Chat;
