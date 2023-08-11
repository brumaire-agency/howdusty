import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import { getContributionsCount } from './helpers';
import { ContributionsByRepository } from './types';

export class githubIssuePullRequestRatioQuery extends GithubQuery<
  githubIssuePullRequestRatioResult,
  githubIssuePullRequestRatioData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      githubIssuePullRequestRatio: user(login: "${username}") {
        contributionsCollection {
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

  parseResult(
    result: githubIssuePullRequestRatioResult,
  ): githubIssuePullRequestRatioData {
    // Issue
    const issueContributionsCount: number = getContributionsCount(
      result.githubIssuePullRequestRatio.contributionsCollection
        .issueContributionsByRepository,
    );

    // Pull Request
    const pullRequestContributionsCount: number = getContributionsCount(
      result.githubIssuePullRequestRatio.contributionsCollection
        .pullRequestContributionsByRepository,
    );

    return {
      githubIssuePullRequestRatio:
        issueContributionsCount === 0 && pullRequestContributionsCount === 0
          ? 0
          : issueContributionsCount /
            (issueContributionsCount + pullRequestContributionsCount),
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface githubIssuePullRequestRatioResult extends GithubResponse {
  githubIssuePullRequestRatio: {
    contributionsCollection: {
      issueContributionsByRepository: ContributionsByRepository[];
      pullRequestContributionsByRepository: ContributionsByRepository[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface githubIssuePullRequestRatioData extends GithubData {
  githubIssuePullRequestRatio: number;
}
