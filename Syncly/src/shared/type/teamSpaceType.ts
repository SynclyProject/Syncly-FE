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

export type TInvite = {
  expiresAt: string;
  invitationId: number;
  inviterName: string;
  workspaceName: string;
};
