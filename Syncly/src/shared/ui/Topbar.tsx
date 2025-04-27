import Icon from "./Icon";

const Topbar = () => {
  return (
    <div className="w-full h-[70px] bg-white px-[30px] flex justify-between items-center border-[#E0E0E0]">
      <p className="text-xl font-bold">Syncly</p>
      <div className="flex gap-[10px]">
        <Icon name="Bell" />
        <Icon name="User_Circle" />
        <Icon name="Log_Out" />
      </div>
    </div>
  );
};

export default Topbar;
