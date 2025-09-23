import { createContext, useContext, PropsWithChildren, useState } from "react";

type TFileContext = {
  folderId: number;
  setFolderId: (folderId: number) => void;
  fileId: number;
  setFileId: (fileId: number) => void;
  folderPath: Map<number, string>;
  setFolderPath: (folderPath: Map<number, string>) => void;
};

const FileContext = createContext<TFileContext | null>(null);

export const FileProvider = ({ children }: PropsWithChildren) => {
  const [folderId, setFolderId] = useState<number>(0);
  const [fileId, setFileId] = useState<number>(0);
  const [folderPath, setFolderPath] = useState<Map<number, string>>(
    new Map([[1, "Root"]])
  );

  return (
    <FileContext.Provider
      value={{
        folderId,
        setFolderId,
        fileId,
        setFileId,
        folderPath,
        setFolderPath,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export function useFileContext() {
  const context = useContext(FileContext);
  if (context == null) {
    throw new Error("FileProvider를 찾을 수 없습니다.");
  }

  return context;
}
