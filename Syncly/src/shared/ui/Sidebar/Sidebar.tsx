import Button from "../Button";
import MySpace from "./MySpace";
import TeamSpace from "./TeamSpace";

const SideBar = () => {
  return (
    <div className="flex flex-col gap-[30px] w-[256px] h-full border border-[#E0E0E0] bg-[#F7F9FB] px-[8px]">
      <Button
        colorType="main"
        iconName="add_circle_outline"
        className="w-full mt-[21px]"
      >
        New Workspace
      </Button>
      <MySpace />
      <TeamSpace />
    </div>
  );
};
export default SideBar;
