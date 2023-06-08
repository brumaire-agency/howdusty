import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';
import {
  ContributionsByRepository,
  CreatedRepositoryContribution,
  GetContributorInfoQuery,
  User,
} from './types';

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
          contributionsCollection {
            repositoryContributions(first: 100) {
              nodes {
                repository {
                  name
                  licenseInfo {
                    key
                  }
                  isFork
                  isPrivate
                }
              }
            }
            commitContributionsByRepository {
              contributions(first: 100) {
                totalCount
              }
              repository {
                licenseInfo {
                  key
                }
                isFork
                isPrivate
              }
            }
            issueContributionsByRepository {
              contributions(first: 100) {
                totalCount
              }
              repository {
                licenseInfo {
                  key
                }
                isFork
                isPrivate
              }
            }
            pullRequestContributionsByRepository {
              contributions(first: 100) {
                totalCount
              }
              repository {
                licenseInfo {
                  key
                }
                isFork
                isPrivate
              }
            }
          }
        }
      }
    `;
    const result: GetContributorInfoQuery = await graphQLClient.request(query);

    // Repositories
    const repositoriesContributions: CreatedRepositoryContribution[] =
      this.createdOpenSourceRepositories(
        result.user.contributionsCollection.repositoryContributions.nodes,
      );
    const totalRepositoriesContributions = repositoriesContributions.length;

    // Commit
    const commitContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.user.contributionsCollection.commitContributionsByRepository,
      );
    const totalCommitContributions =
      this.totalContributionsFromRepositories(commitContributions);

    // Issue
    const issueContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.user.contributionsCollection.issueContributionsByRepository,
      );
    const totalIssueContributions =
      this.totalContributionsFromRepositories(issueContributions);

    // Pull Request
    const pullRequestContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.user.contributionsCollection
          .pullRequestContributionsByRepository,
      );
    const totalPullRequestContributions =
      this.totalContributionsFromRepositories(pullRequestContributions);

    return {
      id: result.user.id,
      username: result.user.login,
      name: result.user.name,
      avatarUrl: result.user.avatarUrl,
      totalContributions:
        totalRepositoriesContributions +
        totalCommitContributions +
        totalIssueContributions +
        totalPullRequestContributions,
    };
  }

  /**
   * Return contributions from open source repositories.
   */
  contributionsFromOpenSourceRepositories(
    contributionsByRepository: ContributionsByRepository[],
  ): ContributionsByRepository[] {
    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];
    return contributionsByRepository.filter(
      (contributionByRepository) =>
        !contributionByRepository.repository.isFork &&
        !contributionByRepository.repository.isPrivate &&
        openSourceLicenses.includes(
          contributionByRepository.repository.licenseInfo?.key,
        ),
    );
  }

  /**
   * Return created open source repositories.
   */
  createdOpenSourceRepositories(
    createdRepositories: CreatedRepositoryContribution[],
  ): CreatedRepositoryContribution[] {
    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];
    return createdRepositories.filter(
      (createdRepository) =>
        !createdRepository.repository.isFork &&
        !createdRepository.repository.isPrivate &&
        openSourceLicenses.includes(
          createdRepository.repository.licenseInfo?.key,
        ),
    );
  }

  /**
   * Return total contributions.
   */
  totalContributionsFromRepositories(
    contributionsByRepository: ContributionsByRepository[],
  ) {
    let totalContributions = 0;
    contributionsByRepository.forEach((contributionByRepository) => {
      totalContributions =
        totalContributions + contributionByRepository.contributions.totalCount;
    });
    return totalContributions;
  }
}
