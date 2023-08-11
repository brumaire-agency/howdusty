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
