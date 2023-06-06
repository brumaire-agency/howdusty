import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';
import { GetContributorInfoQuery, User } from './types';

@Injectable()
export class GithubApi {
  constructor(private readonly config: ConfigService) {}

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

    const query = gql`
      {
        user(login: "${contributorUsername}") {
          avatarUrl
          login
          name
          id
          repositoriesContributedTo(privacy: PUBLIC) {
            totalCount
          }
        }
      }
    `;
    const result: GetContributorInfoQuery = await graphQLClient.request(query);

    return {
      id: result.user.id,
      username: result.user.login,
      name: result.user.name,
      avatarUrl: result.user.avatarUrl,
      totalContributions: result.user.repositoriesContributedTo.totalCount,
    };
  }
}
