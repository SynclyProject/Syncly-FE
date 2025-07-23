import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import AlarmModal from "../../components/alarm/AlarmModal";
import { useState } from "react";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hideIcon =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/createps";
  const [showAlarm, setShowAlarm] = useState(false);

  return (
    <div className="w-full h-[70px] bg-white px-7 flex justify-between items-center border border-[#E0E0E0]">
      <p
        className="text-[20px] font-[600] cursor-pointer"
        onClick={() => navigate("/")}
      >
        Syncly
      </p>
      {!hideIcon && (
        <div className="flex gap-[16px]">
          <button className="bg-transparent border-none cursor-pointer" onClick={() => setShowAlarm(!showAlarm)}>
            <Icon name="Bell" />
          </button>

          {/* 알람모달 */}
          <AlarmModal isOpen={showAlarm} onClose={() => setShowAlarm(false)} />

          <button
            className="bg-transparent border-none cursor-pointer"
            onClick={() => navigate("/my-page")}
          >
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
