import { Injectable } from '@nestjs/common';
import { MetricName } from '@/metrics';
import { GithubApi } from './github.api';
import {
  ActiveContributionWeeksQuery,
  ContributedRepositoryCountQuery,
  IssuePullRequestRatioQuery,
  MaintainedRepositoryCountQuery,
  TotalContributionsQuery,
  UserInfoQuery,
  GithubQueries,
} from './queries';
import { User } from './types';

@Injectable()
export class GithubService {
  private allQueries: GithubQueries;

  constructor(private api: GithubApi) {
    this.allQueries = {
      [MetricName.activeContributionWeeks]: new ActiveContributionWeeksQuery(),
      [MetricName.contributedRepositoryCount]:
        new ContributedRepositoryCountQuery(),
      [MetricName.issuePullRequestRatio]: new IssuePullRequestRatioQuery(),
      [MetricName.maintainedRepositoryCount]:
        new MaintainedRepositoryCountQuery(),
      totalContributions: new TotalContributionsQuery(),
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
