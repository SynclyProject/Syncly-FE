import { TUser } from "./FilesType";

export type TNotes = {
  id: number;
  name: string;
  date: string;
  user: TUser;
  content: string;
};
