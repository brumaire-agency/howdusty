import { User } from './types';

export class GithubApiMock {
  user: User = {
    id: 'githubusernameid',
    username: 'githubusername',
    name: 'Github User Name',
    avatarUrl: 'https://githubusername.com',
    totalContributions: 2,
    contributedRepositoryCount: 1,
    maintainedRepositoryCount: 1,
    issuePullRequestRatio: 0.5,
    activeContributionWeeks: 1,
  };

  /**
   * Gets contributor info from github.
   */
  getContributorInfo(contributorUsername: string): Promise<User> {
    return Promise.resolve({
      id: this.user.id,
      username: contributorUsername,
      name: this.user.name,
      avatarUrl: this.user.avatarUrl,
      totalContributions: this.user.totalContributions,
      contributedRepositoryCount: this.user.contributedRepositoryCount,
      maintainedRepositoryCount: this.user.maintainedRepositoryCount,
      issuePullRequestRatio: this.user.issuePullRequestRatio,
      activeContributionWeeks: this.user.activeContributionWeeks,
    });
  }
}
