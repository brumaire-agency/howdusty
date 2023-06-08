export interface GetContributorInfoQuery {
  user: {
    id: string;
    login: string;
    name: string;
    avatarUrl: string;
    contributionsCollection: {
      repositoryContributions: {
        nodes: CreatedRepositoryContribution[];
      };
      commitContributionsByRepository: ContributionsByRepository[];
      issueContributionsByRepository: ContributionsByRepository[];
      pullRequestContributionsByRepository: ContributionsByRepository[];
    };
  };
}

export interface ContributionsByRepository {
  contributions: {
    totalCount: number;
  };
  repository: RepositoryQuery;
}

export interface CreatedRepositoryContribution {
  repository: RepositoryQuery;
}

export interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
  isPrivate: boolean;
}

export interface LicenseQuery {
  key: string;
}
