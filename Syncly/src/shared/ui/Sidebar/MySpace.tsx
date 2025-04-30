import Space from "../Space";
import { useNavigate } from "react-router-dom";

const MySpace = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[#6E6E6E] font-[600]">MY SPACE</p>
      <Space
        state="my"
        iconName="attachment"
        text="URLs"
        onClick={() => navigate("/")}
      />
      <Space
        state="my"
        iconName="folder_open"
        text="Files"
        onClick={() => navigate("/")}
      />
    </div>
  );
};
export default MySpace;
