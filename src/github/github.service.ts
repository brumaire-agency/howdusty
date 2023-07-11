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
      [MetricName.totalContributions]: new TotalContributionsQuery(),
      ['userInfo']: new UserInfoQuery(),
    };
  }

  async getContributorInfo(username: string) {
    return await this.api.getInfo(username, [this.allQueries['userInfo']]);
  }

  async getMetricsForUser(username: string, metrics: MetricName[]) {
    // Get queries that match the metrics
    const queries = Object.keys(this.allQueries)
      .filter((key) => metrics.includes(key as MetricName))
      .reduce((record, key) => [...record, this.allQueries[key]], []);
    console.log(queries);

    return await this.api.getInfo(username, queries);
  }
}
