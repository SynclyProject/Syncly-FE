import {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";

type TWorkSpaceContext = {
  personalSpaceId: number;
  workspaceId: number;
  setWorkspaceId: (workspaceId: number) => void;
};

const WorkSpaceContext = createContext<TWorkSpaceContext | null>(null);

export const WorkSpaceProvider = ({ children }: PropsWithChildren) => {
  const personalSpaceId = 17;

  // 초기값을 0으로 설정하여 NaN 방지
  const [workspaceId, setWorkspaceId] = useState<number>(0);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "workspaceId") {
        setWorkspaceId(Number(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <WorkSpaceContext.Provider
      value={{
        personalSpaceId,
        workspaceId,
        setWorkspaceId,
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

export function useWorkSpaceContext() {
  const context = useContext(WorkSpaceContext);
  if (context == null) {
    throw new Error("WorkSpaceProvider를 찾을 수 없습니다.");
  }

  return context;
}
