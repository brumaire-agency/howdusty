export interface GetContributorInfoQuery {
  user: {
    id: string;
    login: string;
    name: string;
    avatarUrl: string;
  };
}
