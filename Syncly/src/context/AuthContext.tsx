import {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";
import { jwtDecode } from "jwt-decode";

type TAuthContext = {
  isLogin: boolean;
  memberId: number | null;
  setIsLogin: (state: boolean) => void;
  checkLoginStatus: () => void;
};

const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLogin, setIsLogin] = useState<boolean>(
    !!localStorage.getItem("accessToken")
  );
  const [memberId, setMemberId] = useState<number | null>(null);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("accessToken");
    console.log("🔐 checkLoginStatus: 토큰 확인", { hasToken: !!token });
    setIsLogin(!!token);

    // Extract memberId from JWT token
    if (token) {
      try {
        console.log("🔓 JWT 토큰 decode 시작");
        const decoded = jwtDecode<{ sub?: string; [key: string]: any }>(token);
        console.log("🔓 JWT decode 완료:", decoded);

        // JWT 표준에서 subject는 'sub' 필드에 저장됨
        const memberId = decoded.sub ? Number(decoded.sub) : null;
        console.log("👤 추출된 memberId (from sub):", memberId);

        if (memberId) {
          setMemberId(memberId);
          console.log("✅ memberId 설정 완료:", memberId);
        } else {
          console.warn("⚠️ 토큰에 sub 필드가 없거나 파싱할 수 없습니다");
          console.log("⚠️ 토큰 전체 내용:", decoded);
          setMemberId(null);
        }
      } catch (error) {
        console.error("❌ JWT decode 실패:", error);
        setMemberId(null);
      }
    } else {
      console.log("⚠️ accessToken이 localStorage에 없습니다");
      setMemberId(null);
    }
  };

  useEffect(() => {
    // 초기 로그인 상태 확인
    checkLoginStatus();

    // localStorage 변화 감지를 위한 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        checkLoginStatus();
      }
    };

    // 같은 탭에서의 localStorage 변화 감지
    window.addEventListener("storage", handleStorageChange);

    // 다른 컴포넌트에서 setIsLogin을 호출할 때를 위한 커스텀 이벤트
    const handleLoginChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("loginStatusChanged", handleLoginChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", handleLoginChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        memberId,
        setIsLogin,
        checkLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error("AuthProvider를 찾을 수 없습니다.");
  }

  return context;
}
