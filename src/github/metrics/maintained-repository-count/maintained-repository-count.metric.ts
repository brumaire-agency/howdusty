import {
  GithubGraphResponse,
  Metric,
  MetricData,
} from '@/github/metrics/base.metric';
import {
  getOpenSourceRepositories,
  RepositoryQuery,
} from '@/github/metrics/helpers';

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
    const openSourceRepositories = getOpenSourceRepositories(
      result.maintainedRepositoryCount.repositories.nodes,
    );
    const totalOpenSourceRepositories = openSourceRepositories.length;

    return {
      maintainedRepositoryCount: totalOpenSourceRepositories,
    };
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
