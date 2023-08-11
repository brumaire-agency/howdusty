export interface ContributorInfo {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
  score?: number;
  rank?: number;
}

export interface ContributorMetrics {
  totalPullRequests: number;
  totalIssues: number;
  contributedRepositoryCount: number;
  maintainedRepositoryCount: number;
  issuePullRequestRatio: number;
  activeContributionWeeks: number;
  collectedGrant: number;
  meanGrantPerProject: number;
  contributedProjectCount: number;
  contributionCount: number;
}

export interface ContributorModel extends ContributorInfo {
  metric?: ContributorMetrics;
}

export type ContributorOldModel = ContributorInfo & ContributorMetrics;
