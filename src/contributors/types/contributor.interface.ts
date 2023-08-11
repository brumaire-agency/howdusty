export interface ContributorInfo {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
  score?: number;
  rank?: number;
}

export interface ContributorMetrics {
  githubTotalPullRequests: number;
  githubTotalIssues: number;
  githubContributedRepositoryCount: number;
  githubMaintainedRepositoryCount: number;
  githubIssuePullRequestRatio: number;
  githubActiveContributionWeeks: number;
  onlydustCollectedGrant: number;
  onlydustMeanGrantPerProject: number;
  onlydustContributedProjectCount: number;
  onlydustContributionCount: number;
}

export interface ContributorModel extends ContributorInfo {
  metric?: ContributorMetrics;
}

export type ContributorOldModel = ContributorInfo & ContributorMetrics;
