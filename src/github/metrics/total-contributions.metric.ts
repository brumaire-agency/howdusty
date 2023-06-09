import { GithubGraphResponse, Metric, MetricData } from './base.metric';

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
    const repositoriesContributions: CreatedRepositoryContribution[] =
      this.createdOpenSourceRepositories(
        result.totalContributions.contributionsCollection
          .repositoryContributions.nodes,
      );
    const totalRepositoriesContributions = repositoriesContributions.length;

    // Commit
    const commitContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.totalContributions.contributionsCollection
          .commitContributionsByRepository,
      );
    const totalCommitContributions =
      this.totalContributionsFromRepositories(commitContributions);

    // Issue
    const issueContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.totalContributions.contributionsCollection
          .issueContributionsByRepository,
      );
    const totalIssueContributions =
      this.totalContributionsFromRepositories(issueContributions);

    // Pull Request
    const pullRequestContributions: ContributionsByRepository[] =
      this.contributionsFromOpenSourceRepositories(
        result.totalContributions.contributionsCollection
          .pullRequestContributionsByRepository,
      );
    const totalPullRequestContributions =
      this.totalContributionsFromRepositories(pullRequestContributions);

    return {
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

/**
 * Represents the object returned by the github graphql api.
 */
export interface TotalContributionsResult extends GithubGraphResponse {
  totalContributions: {
    contributionsCollection: {
      repositoryContributions: {
        nodes: CreatedRepositoryContribution[];
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

interface CreatedRepositoryContribution {
  repository: RepositoryQuery;
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
