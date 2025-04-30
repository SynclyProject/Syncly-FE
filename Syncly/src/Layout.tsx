import { Outlet } from "react-router-dom";
import TopBar from "./shared/ui/Topbar";

const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <TopBar />
      <div className="flex">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
