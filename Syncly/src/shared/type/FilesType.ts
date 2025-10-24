export type TFiles = {
  id: number;
  type: TFilesType;
  name: string;
  date: string;
  user: TUser;
};

export type TUser = {
  id: number;
  name: string;
  profileUrl: string | null;
};

export type TFilesType = "folder" | "file" | "image" | "video";
