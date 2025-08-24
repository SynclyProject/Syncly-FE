import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceAccept } from "../shared/api/WorkSpace/get";
import { useAuthContext } from "../context/AuthContext";

const AcceptWorkspacePage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { isLogin } = useAuthContext();

  // 로그인이 되어 있지 않으면 로그인 페이지로 이동
  useEffect(() => {
    if (!isLogin) {
      // 현재 URL을 state로 전달하여 로그인 후 돌아올 수 있도록 함
      const currentPath = `/api/workspaces/accept/${token}`;
      navigate("/login", {
        state: {
          redirectTo: currentPath,
          message: "워크스페이스 초대를 수락하려면 로그인이 필요합니다.",
        },
        replace: true,
      });
      return;
    }
  }, [isLogin, navigate, token]);

  const { isSuccess, isError } = useQuery({
    queryKey: ["workspaceAccept", token],
    queryFn: () => GetSpaceAccept({ token: token ?? "" }),
    enabled: !!token && isLogin, // 로그인 상태일 때만 API 호출
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      alert("초대가 수락되었습니다.");
      navigate("/my-urls", { replace: true });
      window.location.reload();
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      alert("초대 수락에 실패했습니다.");
      navigate("/my-urls", { replace: true });
    }
  }, [isError, navigate]);

  // 로그인이 되어 있지 않으면 로딩 화면 표시
  if (!isLogin) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">초대 수락을 처리 중입니다...</p>
      </div>
    </div>
  );
};

export default AcceptWorkspacePage;
