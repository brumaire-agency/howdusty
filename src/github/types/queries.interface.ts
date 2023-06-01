export interface GetContributorInfoQuery {
  user: {
    login: string;
    name: string;
    avatarUrl: string;
  };
}
