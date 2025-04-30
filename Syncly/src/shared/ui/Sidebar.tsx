import Button from "./Button";

const SideBar = () => {
  return (
    <div className="w-[256px] h-full border border-[#E0E0E0] bg-[#F7F9FB]">
      <Button colorType="main" iconName="add_circle_outline" className="w-full">
        New Workspace
      </Button>
    </div>
  );
};
export default SideBar;
