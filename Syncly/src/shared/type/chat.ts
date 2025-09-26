export type TChatList = {
  items: TChat[];
  nextBeforeSeq: number;
  latestSeq: number;
};

export type TChat = {
  id: number;
  workspaceId: number;
  senderId: number;
  senderName: string;
  senderProfileImage: string;
  msgId: string;
  seq: number;
  content: string;
  createdAt: string;
};
