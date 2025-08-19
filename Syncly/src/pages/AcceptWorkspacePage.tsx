import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetSpaceAccept } from "../shared/api/WorkSpace/get";

const AcceptWorkspacePage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const { isSuccess, isError } = useQuery({
    queryKey: ["workspaceAccept", token],
    queryFn: () => GetSpaceAccept({ token: token ?? "" }),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      alert("초대가 수락되었습니다.");
      navigate("/my-urls", { replace: true });
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      alert("초대 수락에 실패했습니다. 링크를 다시 확인해주세요.");
      navigate("/", { replace: true });
    }
  }, [isError, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">초대 수락을 처리 중입니다...</p>
      </div>
    </div>
  );
};

export default AcceptWorkspacePage;
