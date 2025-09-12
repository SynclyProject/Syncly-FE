import Icon from "../../shared/ui/Icon";

type TPeopleProps = {
  profile: string;
  name: string;
  audio: boolean;
  screen: boolean;
};

const People = ({ profile, name, audio, screen }: TPeopleProps) => {
  return (
    <div className="flex gap-2 items-center">
      {profile === "" ? (
        <Icon name="User_Circle" />
      ) : (
        <img
          src={`${import.meta.env.VITE_IMAGE_URL}/${profile}`}
          alt="profile"
          className="w-[30px] h-[30px] rounded-full"
        />
      )}
      <p className="text-[16px] flex-1">{name}</p>
      <Icon name="Screen" />
      <Icon name={audio ? "Headset" : "Headset_off"} />
      <Icon name={screen ? "Microphone_on" : "Microphone_off"} />
    </div>
  );
};

export default People;
