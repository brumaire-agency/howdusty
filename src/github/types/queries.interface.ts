export interface GetContributorInfoQuery {
  user: {
    id: string;
    login: string;
    name: string;
    avatarUrl: string;
    repositoriesContributedTo: {
      totalCount: number;
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
