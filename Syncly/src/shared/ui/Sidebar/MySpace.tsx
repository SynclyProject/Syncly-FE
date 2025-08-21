import Space from "./Space";
import { useNavigate, useLocation } from "react-router-dom";

const MySpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">MY SPACE</p>
      <Space
        state="my"
        iconName="attachment"
        text="URLs"
        onClick={() => {
          navigate("/my-urls");
        }}
        click={location.pathname === "/my-urls"}
      />
      <Space
        state="my"
        iconName="folder_open"
        text="Files"
        onClick={() => {
          navigate("/my-files");
        }}
        click={location.pathname === "/my-files"}
      />
    </div>
  );
};
export default MySpace;
