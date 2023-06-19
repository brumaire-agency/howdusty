import {
  GithubGraphResponse,
  Metric,
  MetricData,
} from '@/github/metrics/base.metric';
import {
  getOpenSourceRepositories,
  RepositoryQuery,
} from '@/github/metrics/helpers';

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
    const openSourceRepositories = getOpenSourceRepositories(
      result.contributedRepositoryCount.repositoriesContributedTo.nodes,
    );
    const totalOpenSourceRepositories = openSourceRepositories.length;

    return {
      contributedRepositoryCount: totalOpenSourceRepositories,
    };
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
