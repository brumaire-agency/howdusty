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
      githubTotalPullRequests: contributor.metrics.githubTotalPullRequests,
      githubTotalIssues: contributor.metrics.githubTotalIssues,
      githubContributedRepositoryCount:
        contributor.metrics.githubContributedRepositoryCount,
      githubMaintainedRepositoryCount:
        contributor.metrics.githubMaintainedRepositoryCount,
      githubIssuePullRequestRatio:
        contributor.metrics.githubIssuePullRequestRatio,
      githubActiveContributionWeeks:
        contributor.metrics.githubActiveContributionWeeks,
    });
  }
}
