import { Outlet } from "react-router-dom";
import Topbar from "./shared/ui/Topbar";

const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <Topbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
