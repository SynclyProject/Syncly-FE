import Button from "../Button";
import MySpace from "./MySpace";
import TeamSpace from "./TeamSpace";
import { useState } from "react";

const SideBar = () => {
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="flex flex-col gap-[30px] w-[256px] h-full border border-[#E0E0E0] bg-[#F7F9FB] px-[8px]">
      <Button
        colorType="main"
        iconName="add_circle_outline"
        className="w-full mt-[21px]"
        onClick={() => setShowInput(true)}
      >
        New Workspace
      </Button>
      <MySpace />
      <TeamSpace showInput={showInput} setShowInput={setShowInput} />
    </div>
  );
};
export default SideBar;
