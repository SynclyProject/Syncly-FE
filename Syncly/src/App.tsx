import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreatePWPage from "./pages/CreatePWPage";
import MyURLsPage from "./pages/My/MyURLsPage";
import MyFilesPage from "./pages/My/MyFilesPage";
import MyPage from "./pages/MyPage";
import TeamURLsPage from "./pages/Team/TeamURLsPage";
import TeamFilesPage from "./pages/Team/TeamFilesPage";
import TeamScreenPage from "./pages/Team/TeamScreenPage";
import AcceptWorkspacePage from "./pages/AcceptWorkspacePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { WorkSpaceProvider } from "./context/workSpaceContext";
import TestPage from "./pages/testPage";
import OAuthCallback from "./shared/api/common/OAuthSuccessPage";

const queryClient = new QueryClient();

const AuthRoute = ({ children }: PropsWithChildren) => {
  const { isLogin } = useAuthContext();
  if (isLogin == false) {
    alert("로그인을 해주세요.");
    return <Navigate to="/login" replace />;
  }
  return children;
};
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
        path: "create-pw",
        element: <CreatePWPage />,
      },
      {
        path: "my-urls",
        element: (
          <AuthRoute>
            <MyURLsPage />
          </AuthRoute>
        ),
      },
      {
        path: "my-files",
        element: (
          <AuthRoute>
            <MyFilesPage />
          </AuthRoute>
        ),
      },
      {
        path: "my-page",
        element: (
          <AuthRoute>
            <MyPage />
          </AuthRoute>
        ),
      },
      {
        path: "team-urls/:id",
        element: (
          <AuthRoute>
            <TeamURLsPage />
          </AuthRoute>
        ),
      },
      {
        path: "team-files/:id",
        element: (
          <AuthRoute>
            <TeamFilesPage />
          </AuthRoute>
        ),
      },
      {
        path: "team-screen/:id",
        element: (
          <AuthRoute>
            <TeamScreenPage />
          </AuthRoute>
        ),
      },
      {
        path: "api/workspaces/accept/:token",
        element: <AcceptWorkspacePage />,
      },
      {
        path: "test",
        element: <TestPage />,
      },
      {
        path: "oauth2/callback", 
        element: <OAuthCallback />,
      },

    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkSpaceProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </WorkSpaceProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
