import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';
import { Metric, TotalContributionsMetric, UserInfoMetric } from './metrics';

@Injectable()
export class GithubApi {
  private metrics: Metric[];

  constructor(private readonly config: ConfigService) {
    this.metrics = [new UserInfoMetric(), new TotalContributionsMetric()];
  }

  /**
   * Gets contributor info from github.
   */
  async getContributorInfo(contributorUsername: string): Promise<any> {
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

    return data;
  }
}
