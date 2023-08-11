import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import { RepositoriesQuery } from '@/github/queries/helpers';
import { getContributionsCount } from './helpers';
import { ContributionsByRepository } from './types';

export class TotalPullRequestsQuery extends GithubQuery<
  TotalPullRequestsResult,
  TotalPullRequestsData
> {
  buildQuery(username: string): string {
    return `
      totalContributions: user(login: "${username}") {
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
    `;
  }

  parseResult(result: TotalPullRequestsResult): TotalPullRequestsData {
    // Pull Request
    const pullRequestContributionsCount: number = getContributionsCount(
      result.totalContributions.contributionsCollection
        .pullRequestContributionsByRepository,
    );

    return {
      totalPullRequests: pullRequestContributionsCount,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface TotalPullRequestsResult extends GithubResponse {
  totalContributions: {
    contributionsCollection: {
      repositoryContributions: {
        nodes: RepositoriesQuery[];
      };
      commitContributionsByRepository: ContributionsByRepository[];
      issueContributionsByRepository: ContributionsByRepository[];
      pullRequestContributionsByRepository: ContributionsByRepository[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface TotalPullRequestsData extends GithubData {
  totalPullRequests: number;
}
