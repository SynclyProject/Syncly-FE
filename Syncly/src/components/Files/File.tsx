import Icon from "../../shared/ui/Icon";

type TTypeProps = {
  type: "folder" | "image" | "file" | "video";
};
interface IFileProps extends TTypeProps {
  title: string;
  date: string;
  user?: string;
}

const File = ({ type, title, date, user }: IFileProps) => {
  return (
    <div className="w-full h-[56px] bg-white flex items-center gap-[63px] border-t border-t-[#E0E0E0">
      <Icon name={type} />
      <p className="flex-1 overflow-hidden text-ellipsis text-[16px] font-semibold">
        {title}
      </p>
      <p className="text-[#828282]">{date}</p>
      {user && <Icon name={user} />}
      <Icon name="more-horizontal" />
    </div>
  );
};
export default File;
