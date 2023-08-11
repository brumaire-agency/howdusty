import { Injectable } from '@nestjs/common';
import { MetricName } from '@/metrics';
import { GithubApi } from './github.api';
import {
  githubActiveContributionWeeksQuery,
  githubContributedRepositoryCountQuery,
  githubIssuePullRequestRatioQuery,
  githubMaintainedRepositoryCountQuery,
  githubTotalPullRequestsQuery,
  githubTotalIssuesQuery,
  UserInfoQuery,
  GithubQueries,
} from './queries';
import { User } from './types';

@Injectable()
export class GithubService {
  private allQueries: GithubQueries;

  constructor(private api: GithubApi) {
    this.allQueries = {
      [MetricName.githubActiveContributionWeeks]:
        new githubActiveContributionWeeksQuery(),
      [MetricName.githubContributedRepositoryCount]:
        new githubContributedRepositoryCountQuery(),
      [MetricName.githubIssuePullRequestRatio]:
        new githubIssuePullRequestRatioQuery(),
      [MetricName.githubMaintainedRepositoryCount]:
        new githubMaintainedRepositoryCountQuery(),
      [MetricName.githubTotalPullRequests]: new githubTotalPullRequestsQuery(),
      [MetricName.githubTotalIssues]: new githubTotalIssuesQuery(),
      ['userInfo']: new UserInfoQuery(),
    };
  }

  async getContributorInfo(username: string) {
    return await this.api.getInfo(username, [this.allQueries['userInfo']]);
  }

  async getMetricsForUser(
    username: string,
    metrics: MetricName[],
  ): Promise<User> {
    // Get queries that match the metrics
    const queries = Object.keys(this.allQueries)
      .filter((key) => metrics.includes(key as MetricName))
      .reduce((record, key) => [...record, this.allQueries[key]], []);

    return await this.api.getInfo(username, queries);
  }
}
