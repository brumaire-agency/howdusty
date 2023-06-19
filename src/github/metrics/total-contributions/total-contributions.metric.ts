import {
  GithubGraphResponse,
  Metric,
  MetricData,
} from '@/github/metrics/base.metric';
import {
  getOpenSourceContributionsRepositories,
  RepositoriesQuery,
} from '@/github/metrics/helpers';
import { getContributionsCount } from './helpers';
import { ContributionsByRepository } from './types';

export class TotalContributionsMetric extends Metric<
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
    // Repositories
    const repositoriesContributions: RepositoriesQuery[] =
      getOpenSourceContributionsRepositories(
        result.totalContributions.contributionsCollection
          .repositoryContributions.nodes,
      );
    const repositoriesContributionsCount = repositoriesContributions.length;

    // Commit
    const commitContributionsCount: number = getContributionsCount(
      result.totalContributions.contributionsCollection
        .commitContributionsByRepository,
    );

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
      totalContributions:
        repositoriesContributionsCount +
        commitContributionsCount +
        issueContributionsCount +
        pullRequestContributionsCount,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface TotalContributionsResult extends GithubGraphResponse {
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
export interface TotalContributionsData extends MetricData {
  totalContributions: number;
}
