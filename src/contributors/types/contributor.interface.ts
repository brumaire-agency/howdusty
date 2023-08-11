export interface ContributorInfo {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
  githubScore?: number;
  githubRank?: number;
  onlydustScore?: number;
  onlydustRank?: number;
  globalScore?: number;
  globalRank?: number;
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
