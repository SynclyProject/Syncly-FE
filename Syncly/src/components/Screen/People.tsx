import Icon from "../../shared/ui/Icon";

type TPeopleProps = {
  profile: string;
  name: string;
};

const People = ({ profile, name }: TPeopleProps) => {
  return (
    <div className="flex gap-2 items-center">
      <Icon name={profile} />
      <p className="text-[16px] flex-1">{name}</p>
      <Icon name="Screen" />
      <Icon name="Headset" />
      <Icon name="Microphone_on" />
    </div>
  );
};

export default People;
