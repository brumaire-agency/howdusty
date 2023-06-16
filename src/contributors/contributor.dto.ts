export class ContributorDto {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  totalContributions: number;
  contributedRepositoryCount: number;
  maintainedRepositoryCount: number;
  issuePullRequestRatio: number;
  activeContributionWeeks: number;
}
