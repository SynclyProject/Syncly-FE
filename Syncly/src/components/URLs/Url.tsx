import Icon from "../../shared/ui/Icon";

type TUrlStateProps = {
  state: "input" | "url";
};
interface IUrlProps extends TUrlStateProps {
  text?: string;
}

const Url = ({ state, text }: IUrlProps) => {
  return (
    <div className="flex w-full h-[48px] px-[5px] items-center bg-white border-t border-t-[#E0E0E0] gap-2">
      <Icon name="url" />
      {state == "input" ? (
        <>
          <input
            className="flex-1 font-medium focus:outline-none"
            placeholder="Enter a link..."
          />
          <Icon name="plus_blue" />
        </>
      ) : (
        <>
          <p className="flex-1 text-[16px] font-semibold">{text}</p>
          <Icon name="Trash_Full" />
        </>
      )}
    </div>
  );
};

export default Url;
