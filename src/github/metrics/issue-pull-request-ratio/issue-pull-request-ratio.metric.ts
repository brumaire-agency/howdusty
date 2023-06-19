import {
  GithubGraphResponse,
  Metric,
  MetricData,
} from '@/github/metrics/base.metric';
import { getContributionsCount } from './helpers';
import { ContributionsByRepository } from './types';

export class IssuePullRequestRatioMetric extends Metric<
  IssuePullRequestRatioResult,
  IssuePullRequestRatioData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      issuePullRequestRatio: user(login: "${username}") {
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

  parseResult(result: IssuePullRequestRatioResult): IssuePullRequestRatioData {
    // Issue
    const issueContributionsCount: number = getContributionsCount(
      result.issuePullRequestRatio.contributionsCollection
        .issueContributionsByRepository,
    );

    // Pull Request
    const pullRequestContributionsCount: number = getContributionsCount(
      result.issuePullRequestRatio.contributionsCollection
        .pullRequestContributionsByRepository,
    );

    return {
      issuePullRequestRatio:
        issueContributionsCount /
        (issueContributionsCount + pullRequestContributionsCount),
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface IssuePullRequestRatioResult extends GithubGraphResponse {
  issuePullRequestRatio: {
    contributionsCollection: {
      issueContributionsByRepository: ContributionsByRepository[];
      pullRequestContributionsByRepository: ContributionsByRepository[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface IssuePullRequestRatioData extends MetricData {
  issuePullRequestRatio: number;
}
