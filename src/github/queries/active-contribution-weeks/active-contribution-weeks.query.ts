import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import {
  getWeeksOfContributions,
  getWeeksOfCreatedRepositories,
  removeDuplicateWeeks,
} from './helpers';
import {
  ContributionsByRepository,
  CreatedRepositories,
  WeekObject,
} from './types';

export class githubActiveContributionWeeksQuery extends GithubQuery {
  buildQuery(username: string): string {
    return `
      githubActiveContributionWeeks: user(login: "${username}") {
        contributionsCollection {
          repositoryContributions(first: 100) {
            nodes {
              occurredAt
              repository {
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
              nodes {
                occurredAt
              }
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
              nodes {
                occurredAt
              }
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
              nodes {
                occurredAt
              }
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

  parseResult(
    result: githubActiveContributionWeeksResult,
  ): githubActiveContributionWeeksData {
    // Repository
    const repositoryWeeks: WeekObject[] = getWeeksOfCreatedRepositories(
      result.githubActiveContributionWeeks.contributionsCollection
        .repositoryContributions.nodes,
    );

    // Commit
    const commitWeeks: WeekObject[] = getWeeksOfContributions(
      result.githubActiveContributionWeeks.contributionsCollection
        .commitContributionsByRepository,
    );

    // Issue
    const issueWeeks: WeekObject[] = getWeeksOfContributions(
      result.githubActiveContributionWeeks.contributionsCollection
        .issueContributionsByRepository,
    );

    // Pull Request
    const pullRequestWeeks: WeekObject[] = getWeeksOfContributions(
      result.githubActiveContributionWeeks.contributionsCollection
        .pullRequestContributionsByRepository,
    );

    const allWeeks = removeDuplicateWeeks([
      ...repositoryWeeks,
      ...commitWeeks,
      ...issueWeeks,
      ...pullRequestWeeks,
    ]);

    return {
      githubActiveContributionWeeks: allWeeks.length,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface githubActiveContributionWeeksResult extends GithubResponse {
  githubActiveContributionWeeks: {
    contributionsCollection: {
      repositoryContributions: {
        nodes: CreatedRepositories[];
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
export interface githubActiveContributionWeeksData extends GithubData {
  githubActiveContributionWeeks: number;
}
