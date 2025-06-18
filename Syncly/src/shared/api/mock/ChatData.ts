interface IChatData {
  id: number;
  who: "me" | "other";
  name: string;
  profile: string;
  message: string;
  time: string;
}

export const chatData: IChatData[] = [
  {
    id: 1,
    who: "me",
    name: "John Doe",
    profile: "User_Circle",
    message: "Hello, how are you?",
    time: "12:00",
  },
  {
    id: 2,
    who: "other",
    name: "Gavin",
    profile: "User_Circle",
    message: "I'm fine, thank you!",
    time: "12:01",
  },
  {
    id: 3,
    who: "other",
    name: "Alice",
    profile: "User_Circle",
    message: "Hello, I'm Alice",
    time: "12:02",
  },
  {
    id: 4,
    who: "other",
    name: "Bob",
    profile: "User_Circle",
    message: "Nice to meet you",
    time: "12:03",
  },
  {
    id: 5,
    who: "me",
    name: "John Doe",
    profile: "User_Circle",
    message: "what are you doing?",
    time: "12:10",
  },
];
