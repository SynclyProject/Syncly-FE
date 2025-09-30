import { useShowImage } from "../../hooks/useShowImage";
import Icon from "../../shared/ui/Icon";

type TPeopleProps = {
  profile: string | null;
  name: string;
  audio: boolean;
  screen: boolean;
  cam?: boolean;
};

const People = ({ profile, name, audio, screen, cam }: TPeopleProps) => {
  const profileImageUrl = useShowImage(profile);
  return (
    <div className="flex gap-2 items-center">
      {profile === null ? (
        <Icon name="User_Circle" />
      ) : (
        <img
          src={profileImageUrl ?? undefined}
          alt="profile"
          className="w-[30px] h-[30px] rounded-full"
        />
      )}
      <p className="text-[16px] flex-1">{name}</p>
      <Icon name={screen ? "Screen" : "Screen_off"} />
      <Icon name={cam ? "Cam_on" : "Cam_off"} />
      <Icon name={audio ? "Microphone_on" : "Microphone_off"} />
    </div>
  );
};

export default People;
