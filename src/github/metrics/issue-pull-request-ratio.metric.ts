import { GithubGraphResponse, Metric, MetricData } from './base.metric';

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
    const issueContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.issuePullRequestRatio.contributionsCollection
          .issueContributionsByRepository,
      );
    const totalIssueContributions =
      this.totalContributionsFromRepositories(issueContributions);

    // Pull Request
    const pullRequestContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.issuePullRequestRatio.contributionsCollection
          .pullRequestContributionsByRepository,
      );
    const totalPullRequestContributions =
      this.totalContributionsFromRepositories(pullRequestContributions);

    return {
      issuePullRequestRatio:
        totalIssueContributions /
        (totalIssueContributions + totalPullRequestContributions),
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

interface ContributionsByRepository {
  contributions: {
    totalCount: number;
  };
  repository: RepositoryQuery;
}

interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
  isPrivate: boolean;
}

interface LicenseQuery {
  key: string;
}
