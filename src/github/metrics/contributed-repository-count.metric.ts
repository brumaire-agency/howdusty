import { GithubGraphResponse, Metric, MetricData } from './base.metric';

export class ContributedRepositoryCountMetric extends Metric<
  ContributedRepositoryCountResult,
  ContributedRepositoryCountData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      contributedRepositoryCount: user(login: "${username}") {
        repositoriesContributedTo(first: 100, privacy: PUBLIC) {
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
    result: ContributedRepositoryCountResult,
  ): ContributedRepositoryCountData {
    const openSourceRepositories = this.openSourceRepositories(
      result.contributedRepositoryCount.repositoriesContributedTo.nodes,
    );
    const totalOpenSourceRepositories = openSourceRepositories.length;

    return {
      contributedRepositoryCount: totalOpenSourceRepositories,
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
export interface ContributedRepositoryCountResult extends GithubGraphResponse {
  contributedRepositoryCount: {
    repositoriesContributedTo: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface ContributedRepositoryCountData extends MetricData {
  contributedRepositoryCount: number;
}

interface RepositoryQuery {
  licenseInfo?: LicenseQuery;
  isFork: boolean;
}

interface LicenseQuery {
  key: string;
}
