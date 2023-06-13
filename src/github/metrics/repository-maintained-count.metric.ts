import { GithubGraphResponse, Metric, MetricData } from './base.metric';

export class RepositoryMaintainedCountMetric extends Metric<
  RepositoryMaintainedCountResult,
  RepositoryMaintainedCountData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      repositoryMaintainedCount: user(login: "${username}") {
        repositories(first: 100, privacy: PUBLIC) {
          nodes {
              licenseInfo {
                  key
              }
              isFork
          }
        }
      }
    `;
  }

  parseResult(
    result: RepositoryMaintainedCountResult,
  ): RepositoryMaintainedCountData {
    const openSourceRepositories = this.openSourceRepositories(
      result.repositoryMaintainedCount.repositories.nodes,
    );
    const totalOpenSourceRepositories = openSourceRepositories.length;

    return {
      repositoryMaintainedCount: totalOpenSourceRepositories,
    };
  }

  /**
   * Return open source repositories.
   */
  openSourceRepositories(repositories: RepositoryQuery[]): RepositoryQuery[] {
    const openSourceLicenses = ['mit', 'apache-2.0', 'gpl-3.0', 'agpl-3.0'];
    return repositories.filter(
      (repository) =>
        !repository.isFork &&
        openSourceLicenses.includes(repository.licenseInfo?.key),
    );
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface RepositoryMaintainedCountResult extends GithubGraphResponse {
  repositoryMaintainedCount: {
    repositories: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface RepositoryMaintainedCountData extends MetricData {
  repositoryMaintainedCount: number;
}

interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
}

interface LicenseQuery {
  key: string;
}
