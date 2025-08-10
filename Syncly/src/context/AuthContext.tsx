import {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";

type TAuthContext = {
  isLogin: boolean;
  setIsLogin: (state: boolean) => void;
  checkLoginStatus: () => void;
};

const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("accessToken");
    setIsLogin(!!token);
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

  console.log("isLogin", isLogin);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
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
