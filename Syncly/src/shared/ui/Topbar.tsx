import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hideIcon = location.pathname === "/login";
  return (
    <div className="w-full bg-[#FFFFFF] px-[30px] flex justify-between items-center border border-[#E0E0E0]">
      <p
        className="text-[20px] font-[600] cursor-pointer"
        onClick={() => navigate("/")}
      >
        Syncly
      </p>
      {!hideIcon && (
        <div className="flex gap-[10px]">
          <button className="bg-transparent border-none cursor-pointer">
            <Icon name="Bell" />
          </button>
          <button className="bg-transparent border-none cursor-pointer">
            <Icon name="User_Circle" />
          </button>
          <button className="bg-transparent border-none cursor-pointer">
            <Icon name="Log_Out" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TopBar;
