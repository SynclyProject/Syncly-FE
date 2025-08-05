import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreatepsPage from "./pages/CreatepsPage";
import MyURLsPage from "./pages/My/MyURLsPage";
import MyFilesPage from "./pages/My/MyFilesPage";
import MyPage from "./pages/MyPage";
import TeamURLsPage from "./pages/Team/TeamURLsPage";
import TeamFilesPage from "./pages/Team/TeamFilesPage";
import TeamScreenPage from "./pages/Team/TeamScreenPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

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
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
