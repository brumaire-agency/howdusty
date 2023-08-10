export interface User {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
  totalPullRequests: number;
  totalIssues: number;
  contributedRepositoryCount: number;
  maintainedRepositoryCount: number;
  issuePullRequestRatio: number;
  activeContributionWeeks: number;
}
