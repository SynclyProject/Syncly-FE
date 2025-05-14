import Button from "../../shared/ui/Button";
import Url from "./Url";

const URLsInput = () => {
  return (
    <div className="flex flex-col gap-5 w-full min-h-[225px] p-[24px] bg-white border border-[#E0E0E0] rounded-[8px] shadow-[shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]">
      <div className="flex gap-4 h-[52px] items-center ">
        <input
          className="flex-1 text-2xl focus:outline-none"
          placeholder="Enter a title..."
        />
        <Button colorType="sub" iconName="add_circle" />
        <Button colorType="sub">Save Tabs</Button>
        <Button colorType="sub">Open Links</Button>
      </div>
      <p className="text-[#828282] text-[16px] font-semibold">Source</p>
      <div className="flex flex-col">
        <Url state="input" />
      </div>
    </div>
  );
};

export default URLsInput;
