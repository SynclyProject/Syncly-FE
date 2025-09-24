import { TFiles } from "../../type/FilesType";

const FilesData: TFiles[] = [
  {
    id: 1,
    type: "folder",
    name: "UMC",
    date: "2021-01-01",
    user: {
      id: 1,
      name: "userProfile",
      profileUrl: "userProfile",
    },
  },
  {
    id: 2,
    type: "file",
    name: "Project",
    date: "2021-01-01",
    user: {
      id: 1,
      name: "userProfile",
      profileUrl: "userProfile",
    },
  },
  {
    id: 3,
    type: "image",
    name: "Project",
    date: "2021-01-01",
    user: {
      id: 1,
      name: "userProfile",
      profileUrl: "userProfile",
    },
  },
  {
    id: 4,
    type: "video",
    name: "Project",
    date: "2021-01-01",
    user: {
      id: 1,
      name: "userProfile",
      profileUrl: "userProfile",
    },
  },
];

export default FilesData;
