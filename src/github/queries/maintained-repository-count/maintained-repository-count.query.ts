import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import {
  getOpenSourceRepositories,
  RepositoryQuery,
} from '@/github/queries/helpers';

export class MaintainedRepositoryCountQuery extends GithubQuery<
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
      githubMaintainedRepositoryCount: totalOpenSourceRepositories,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface MaintainedRepositoryCountResult extends GithubResponse {
  maintainedRepositoryCount: {
    repositories: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface MaintainedRepositoryCountData extends GithubData {
  githubMaintainedRepositoryCount: number;
}
