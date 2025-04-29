import { Outlet } from "react-router-dom";
import Topbar from "./shared/ui/Topbar";

const RootLayout = () => {
  return (
    <div className="flex flex-col">
      <Topbar />
      <div className="flex">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
