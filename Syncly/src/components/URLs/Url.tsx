import Icon from "../../shared/ui/Icon";

type TUrlStateProps = {
  state: "input" | "url";
};
interface IUrlProps extends TUrlStateProps {
  text?: string;
}

const Url = ({ state, text }: IUrlProps) => {
  return (
    <div className="flex w- full bg-white border-t-[#F4F4F4] gap-2">
      <Icon name="url" />
      {state == "input" ? (
        <>
          <input
            className="flex-1 focus:outline-none"
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
