import {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";
import { useParams } from "react-router-dom";

type TWorkSpaceContext = {
  workspaceId: number;
  setWorkspaceId: (workspaceId: number) => void;
};

const WorkSpaceContext = createContext<TWorkSpaceContext | null>(null);

export const WorkSpaceProvider = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const [workspaceId, setWorkspaceId] = useState<number>(Number(id));

  useEffect(() => {
    setWorkspaceId(Number(id));

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "workspaceId") {
        setWorkspaceId(Number(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleWorkspaceIdChange = () => {
      setWorkspaceId(Number(id));
    };

    window.addEventListener("workspaceIdChanged", handleWorkspaceIdChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("workspaceIdChanged", handleWorkspaceIdChange);
    };
  }, [id]);

  return (
    <WorkSpaceContext.Provider
      value={{
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
