import { useShowImage } from "../../hooks/useShowImage";
import Icon from "../../shared/ui/Icon";

interface IChatProps {
  who: "me" | "other";
  profile: string;
  name: string;
  message: string;
  date: string;
  time: string;
  hideTime?: boolean;
  hideDate?: boolean;
  hideProfile?: boolean;
}

const Chat = ({
  who,
  profile,
  name,
  message,
  date,
  time,
  hideTime,
  hideDate,
  hideProfile,
}: IChatProps) => {
  const profileImageUrl = useShowImage(profile);

  return (
    <div className="flex flex-col gap-2">
      {!hideDate && (
        <div className="text-sm text-[#828282] text-center">
          <span className="inline-block text-sm text-[#828282] bg-[#DEE4ED] rounded-full py-1 px-3 my-3">
            {date}
          </span>
        </div>
      )}
      {who === "me" ? (
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2 items-end">
            {!hideTime && (
              <span className="text-sm text-[#828282]">{time}</span>
            )}
            <p className="text-xs text-white max-w-[200px] flex gap-2 justify-center items-center px-4 py-3 bg-[#456990] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[4px] rounded-bl-[16px]">
              {message}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-start">
          {!hideProfile && (
            <div className="flex gap-2 items-center">
              <div className="w-[32px] h-[32px]">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="profile"
                    className="w-[32px] h-[32px] rounded-full"
                  />
                ) : (
                  <Icon name="User_Default" rounded={true} />
                )}
              </div>
              <p className="text-sm text-[#828282]">{name}</p>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <p className="max-w-[200px] text-sm rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4px] bg-[#E0E0E0] px-4 py-3">
              {message}
            </p>
            {!hideTime && (
              <span className="text-sm text-[#828282]">{time}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
