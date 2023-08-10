import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import { RepositoriesQuery } from '@/github/queries/helpers';
import { getContributionsCount } from './helpers';
import { ContributionsByRepository } from './types';

export class TotalContributionsQuery extends GithubQuery<
  TotalContributionsResult,
  TotalContributionsData
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

  parseResult(result: TotalContributionsResult): TotalContributionsData {
    // Issue
    const issueContributionsCount: number = getContributionsCount(
      result.totalContributions.contributionsCollection
        .issueContributionsByRepository,
    );

    // Pull Request
    const pullRequestContributionsCount: number = getContributionsCount(
      result.totalContributions.contributionsCollection
        .pullRequestContributionsByRepository,
    );

    return {
      totalPullRequests: pullRequestContributionsCount,
      totalIssues: issueContributionsCount,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface TotalContributionsResult extends GithubResponse {
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
export interface TotalContributionsData extends GithubData {
  totalPullRequests: number;
  totalIssues: number;
}
