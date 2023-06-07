import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';
import { GetContributorInfoQuery, RepositoryQuery, User } from './types';

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
          repositoriesContributedTo(
            privacy: PUBLIC
            includeUserRepositories: true
            first: 100
          ) {
            nodes {
              licenseInfo {
                  key
              }
              isFork
            }
          }
        }
      }
    `;
    const result: GetContributorInfoQuery = await graphQLClient.request(query);

    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];

    const openSourceRepositories: RepositoryQuery[] =
      result.user.repositoriesContributedTo.nodes.filter(
        (repository) =>
          repository.isFork &&
          openSourceLicenses.includes(repository.licenseInfo?.key),
      );

    return {
      id: result.user.id,
      username: result.user.login,
      name: result.user.name,
      avatarUrl: result.user.avatarUrl,
      totalContributions: openSourceRepositories.length,
    };
  }

  /**
   * Return open source repositories.
   */
  openSourceRepositories(repositories: RepositoryQuery[]): RepositoryQuery[] {
    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];
    return repositories.filter(
      (repository) =>
        repository.isFork &&
        openSourceLicenses.includes(repository.licenseInfo?.key),
    );
  }
}
