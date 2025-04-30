import { Outlet } from "react-router-dom";
import TopBar from "./shared/ui/Topbar";
import SideBar from "./shared/ui/Sidebar";

const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <TopBar />
      <div className="flex">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
