import Icon from "../shared/ui/Icon";
type TStateProp = {
  state: "urls" | "files";
};

const Navigate = ({ state }: TStateProp) => {
  return (
    <div className="flex">
      <div
        className={
          `w-[173px] h-[32px] flex items-center px-3 gap-2 ` +
          (state === "urls"
            ? "bg-white border-b border-b-[#028090] rounded-[4px]"
            : "")
        }
      >
        <Icon name="attachment" />
        <p className="text-[16px] font-semibold">URLs</p>
      </div>
      <div
        className={
          `w-[173px] h-[32px] flex items-center px-3 gap-2 ` +
          (state === "files"
            ? "bg-white border-b border-b-[#028090] rounded-[4px]"
            : "")
        }
      >
        <Icon name="folder_open" />
        <p>Files</p>
      </div>
    </div>
  );
};

export default Navigate;
