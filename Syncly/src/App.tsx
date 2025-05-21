import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyURLsPage from "./pages/MyURLsPage";
import MyFilesPage from "./pages/MyFilesPage";
import MyPage from "./pages/MyPage";
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
