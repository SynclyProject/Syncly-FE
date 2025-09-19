export type TFiles = {
  id: number;
  type: TFilesType;
  name: string;
  date: string;
  user: TUser;
};

type TUser = {
  id: number;
  name: string;
  profileUrl: string;
};

export type TFilesType = "folder" | "file" | "image" | "video";
