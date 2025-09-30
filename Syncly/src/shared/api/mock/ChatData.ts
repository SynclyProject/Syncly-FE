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
    profile: "userProfile_2",
    message: "Hello, how are you?",
    time: "12:00",
  },
  {
    id: 2,
    who: "other",
    name: "Gavin",
    profile: "userProfile_2",
    message: "I'm fine, thank you!",
    time: "12:01",
  },
  {
    id: 3,
    who: "other",
    name: "Alice",
    profile: "userProfile_2",
    message: "Hello, I'm Alice",
    time: "12:02",
  },
  {
    id: 4,
    who: "other",
    name: "Bob",
    profile: "userProfile_2",
    message: "Nice to meet you",
    time: "12:03",
  },
  {
    id: 5,
    who: "me",
    name: "John Doe",
    profile: "userProfile_2",
    message: "what are you doing?",
    time: "12:10",
  },
];
