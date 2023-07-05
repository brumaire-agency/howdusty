import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';
import {
  Metric,
  TotalContributionsMetric,
  UserInfoMetric,
  ContributedRepositoryCountMetric,
  MaintainedRepositoryCountMetric,
  IssuePullRequestRatioMetric,
  ActiveContributionWeeksMetric,
} from './metrics';
import { User } from './types';
import { UserNotFound } from './exceptions';

@Injectable()
export class GithubApi {
  private metrics: Metric[];

  constructor(private readonly config: ConfigService) {
    this.metrics = [
      new UserInfoMetric(),
      new TotalContributionsMetric(),
      new ContributedRepositoryCountMetric(),
      new MaintainedRepositoryCountMetric(),
      new IssuePullRequestRatioMetric(),
      new ActiveContributionWeeksMetric(),
    ];
  }

  /**
   * Gets contributor info from github.
   */
  async getContributorInfo(contributorUsername: string): Promise<User> {
    const ACCESS_TOKEN = this.config.get('github.access_token');

    const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    const query = this.metrics.reduce(
      (accumulator, currentValue) =>
        `${accumulator} ${currentValue.buildQuery(contributorUsername)}`,
      '',
    );

    try {
      const result = await graphQLClient.request(
        gql`
        query {
          ${query}
        }
      `,
      );
      const data = this.metrics.reduce(
        (accumulator, currentValue) => ({
          ...accumulator,
          ...currentValue.parseResult(result),
        }),
        {},
      );
      return data as User;
    } catch (errors) {
      errors.response.errors.forEach((error) => {
        if (error.type === 'NOT_FOUND') {
          console.log(new UserNotFound(contributorUsername));
        } else {
          console.log('GraphQL error');
        }
      });
    }
  }
}
