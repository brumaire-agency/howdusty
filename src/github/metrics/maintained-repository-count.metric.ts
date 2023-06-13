import { GithubGraphResponse, Metric, MetricData } from './base.metric';

export class MaintainedRepositoryCountMetric extends Metric<
  MaintainedRepositoryCountResult,
  MaintainedRepositoryCountData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      maintainedRepositoryCount: user(login: "${username}") {
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
    result: MaintainedRepositoryCountResult,
  ): MaintainedRepositoryCountData {
    const openSourceRepositories = this.openSourceRepositories(
      result.maintainedRepositoryCount.repositories.nodes,
    );
    const totalOpenSourceRepositories = openSourceRepositories.length;

    return {
      maintainedRepositoryCount: totalOpenSourceRepositories,
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
export interface MaintainedRepositoryCountResult extends GithubGraphResponse {
  maintainedRepositoryCount: {
    repositories: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface MaintainedRepositoryCountData extends MetricData {
  maintainedRepositoryCount: number;
}

interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
}

interface LicenseQuery {
  key: string;
}
