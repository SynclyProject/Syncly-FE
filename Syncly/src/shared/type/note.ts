import { TUser } from "./FilesType";

export type TNotes = {
  id: number;
  title: string;
  date: string;
  user: TUser;
  content: string;
};
