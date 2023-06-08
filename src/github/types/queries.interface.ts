export interface GetContributorInfoQuery {
  user: {
    id: string;
    login: string;
    name: string;
    avatarUrl: string;
    repositoriesContributedTo: {
      nodes: RepositoryQuery[];
    };
  };
}

export interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
}

export interface LicenseQuery {
  key: string;
}
