export type TFiles = {
  id: number;
  type: TFilesType;
  title: string;
  date: string;
  user: string;
};

export type TFilesType = "folder" | "file" | "image" | "video";
