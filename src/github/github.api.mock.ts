import { faker } from '@faker-js/faker';
import { GithubQuery, UserInfoQuery } from './queries';
import { ContributorFactory } from '@/contributors';
import { MetricsFactory } from '@/metrics/metrics.factory';
export class GithubApiMock {
  /**
   * Gets info from github.
   */
  getInfo(username: string, queries: GithubQuery[]) {
    faker.seed(42);
    const metrics = MetricsFactory.generate();
    const contributor = ContributorFactory.generate({ username, metrics });
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
      totalContributions: contributor.metrics.totalContributions,
      contributedRepositoryCount:
        contributor.metrics.contributedRepositoryCount,
      maintainedRepositoryCount: contributor.metrics.maintainedRepositoryCount,
      issuePullRequestRatio: contributor.metrics.issuePullRequestRatio,
      activeContributionWeeks: contributor.metrics.activeContributionWeeks,
    });
  }
}
