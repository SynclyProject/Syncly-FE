import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./shared/ui/Topbar";
import SideBar from "./shared/ui/Sidebar/Sidebar";

const RootLayout = () => {
  const location = useLocation();
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar />
      <div className="flex h-full overflow-hidden">
        {!hideSidebar && <SideBar />}
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
