import { Link } from "react-router-dom";
import Button from "./Button";
import Space from "./Space";

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
      <div className="flex flex-col gap-[8px]">
        <p className="text-[#6E6E6E] font-[600]">MY SPACE</p>
        <Space
          state="my"
          iconName="attachment"
          text="URLs"
          onClick={() => Link}
        />
        <Space
          state="my"
          iconName="folder_open"
          text="Files"
          onClick={() => Link}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <p className="text-[#6E6E6E] font-[600]">TEAM SPACES</p>
        <Space
          state="team"
          iconName="attachment"
          text="UMC"
          onClick={() => Link}
        />
        <Space
          state="team"
          iconName="folder_open"
          text="Project"
          onClick={() => Link}
        />
      </div>
    </div>
  );
};
export default SideBar;
