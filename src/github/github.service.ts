import { Injectable } from '@nestjs/common';
import { MetricName } from '@/metrics';
import { GithubApi } from './github.api';
import {
  ActiveContributionWeeksQuery,
  ContributedRepositoryCountQuery,
  IssuePullRequestRatioQuery,
  MaintainedRepositoryCountQuery,
  TotalContributionsQuery,
  GithubQuery,
  UserInfoQuery,
} from './queries';

@Injectable()
export class GithubService {
  private allQueries: GithubQuery[];

  constructor(private api: GithubApi) {
    this.allQueries = [
      new ActiveContributionWeeksQuery(),
      new ContributedRepositoryCountQuery(),
      new IssuePullRequestRatioQuery(),
      new MaintainedRepositoryCountQuery(),
      new TotalContributionsQuery(),
      new UserInfoQuery(),
    ];
  }

  async getContributorInfo(username: string) {
    // Only use UserInfoQuery in this function
    return await this.api.getInfo(username, [this.allQueries[5]]);
  }

  async getMetricsForUser(username: string, metrics: MetricName[]) {
    return await this.api.getInfo(username, this.allQueries);
  }
}
