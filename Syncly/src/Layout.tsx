import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./shared/ui/Topbar";
import SideBar from "./shared/ui/Sidebar/Sidebar";

const RootLayout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login";
  return (
    <div className="flex flex-col">
      <TopBar />
      <div className="flex">
        {!hideSidebar && <SideBar />}
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
