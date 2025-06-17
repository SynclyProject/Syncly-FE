import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreatepsPage from "./pages/CreatepsPage";
import MyURLsPage from "./pages/MyURLsPage";
import MyFilesPage from "./pages/MyFilesPage";
import MyPage from "./pages/MyPage";
import TeamURLsPage from "./pages/TeamURLsPage";
import TeamFilesPage from "./pages/TeamFilesPage";
import TeamScreenPage from "./pages/TeamScreenPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <></>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "createps",
        element: <CreatepsPage />,
      },
      {
        path: "my-urls",
        element: <MyURLsPage />,
      },
      {
        path: "my-files",
        element: <MyFilesPage />,
      },
      {
        path: "my-page",
        element: <MyPage />,
      },
      {
        path: "team-urls/:id",
        element: <TeamURLsPage />,
      },
      {
        path: "team-files/:id",
        element: <TeamFilesPage />,
      },
      {
        path: "team-screen/:id",
        element: <TeamScreenPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
