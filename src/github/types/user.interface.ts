export interface User {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
  githubTotalPullRequests: number;
  githubTotalIssues: number;
  githubContributedRepositoryCount: number;
  githubMaintainedRepositoryCount: number;
  githubIssuePullRequestRatio: number;
  githubActiveContributionWeeks: number;
}
