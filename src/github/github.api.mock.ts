import { faker } from '@faker-js/faker';
import { GithubQuery, UserInfoQuery } from './queries';
import { ContributorFactory } from '@/contributors';
export class GithubApiMock {
  /**
   * Gets info from github.
   */
  getInfo(username: string, queries: GithubQuery[]) {
    faker.seed(42);
    const contributor = ContributorFactory.generate({ username });
    const userInfoIsInclude = queries.some(
      (query) => query instanceof UserInfoQuery,
    );

    if (userInfoIsInclude) {
      return Promise.resolve({
        id: contributor.id,
        username: contributor.username,
        name: contributor.name,
        avatarUrl: contributor.avatarUrl,
      });
    }
    return Promise.resolve({
      totalContributions: contributor.metric.totalContributions,
      contributedRepositoryCount: contributor.metric.contributedRepositoryCount,
      maintainedRepositoryCount: contributor.metric.maintainedRepositoryCount,
      issuePullRequestRatio: contributor.metric.issuePullRequestRatio,
      activeContributionWeeks: contributor.metric.activeContributionWeeks,
    });
  }
}
