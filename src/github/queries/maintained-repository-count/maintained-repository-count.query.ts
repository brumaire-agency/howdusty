import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import {
  getOpenSourceRepositories,
  RepositoryQuery,
} from '@/github/queries/helpers';

export class githubMaintainedRepositoryCountQuery extends GithubQuery<
  githubMaintainedRepositoryCountResult,
  githubMaintainedRepositoryCountData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      githubMaintainedRepositoryCount: user(login: "${username}") {
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
    result: githubMaintainedRepositoryCountResult,
  ): githubMaintainedRepositoryCountData {
    const openSourceRepositories = getOpenSourceRepositories(
      result.githubMaintainedRepositoryCount.repositories.nodes,
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
export interface githubMaintainedRepositoryCountResult extends GithubResponse {
  githubMaintainedRepositoryCount: {
    repositories: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface githubMaintainedRepositoryCountData extends GithubData {
  githubMaintainedRepositoryCount: number;
}
