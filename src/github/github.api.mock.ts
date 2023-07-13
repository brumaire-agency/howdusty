import { faker } from '@faker-js/faker';
import { GithubQuery } from './queries';

export class GithubApiMock {
  /**
   * Gets info from github.
   */
  getInfo(username: string, queries: GithubQuery[]) {
    faker.seed(42);
    return Promise.resolve({
      id: '5cf2bc99-2721-407d-8592-ba00fbdf302f',
      username: username,
      name: 'Nancy Leffler',
      avatarUrl: 'https://avatars.githubusercontent.com/u/39986098',
      totalContributions: 139,
      contributedRepositoryCount: 0,
      maintainedRepositoryCount: 3,
      issuePullRequestRatio: 0.97,
      activeContributionWeeks: 4,
    });
  }
}
