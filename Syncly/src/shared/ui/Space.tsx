import Icon from "./Icon";

type TSpaceStateProps = {
  state: "my" | "team";
};

interface ISpaceProps extends TSpaceStateProps {
  iconName: string;
  text: string;
  onClick: () => void;
}

const Space = ({ state, iconName, text, onClick }: ISpaceProps) => {
  return (
    <div
      className="flex items-center px-[16px] gap-[16px] rounded-[8px] cursor-pointer bg-[#FFF] hover:bg-[#DEE4ED]"
      onClick={onClick}
    >
      {state === "my" ? (
        <Icon name={iconName} />
      ) : (
        <Icon name="supervised_user_circle" />
      )}
      <p className="flex-1">{text}</p>
      <button className="bg-transparent border-none cursor-pointer">
        <Icon name="Vector" />
      </button>
    </div>
  );
};
export default Space;
