export type TTeamSpace = {
  createdAt: string;
  workspaceId: number;
  workspaceName: string;
  workspaceType: string;
  //isEdit: boolean;
};

export type TTeamMember = {
  joinedAt: string;
  memberEmail: string;
  memberName: string;
  role: string;
  workspaceMemberId: number;
};
