import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import { getOpenSourceRepositories, RepositoryQuery } from '../helpers';

export class githubContributedRepositoryCountQuery extends GithubQuery<
  githubContributedRepositoryCountResult,
  githubContributedRepositoryCountData
> {
  /**
   * @inheritDoc
   */
  buildQuery(username: string): string {
    return `
      githubContributedRepositoryCount: user(login: "${username}") {
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
    result: githubContributedRepositoryCountResult,
  ): githubContributedRepositoryCountData {
    const openSourceRepositories = getOpenSourceRepositories(
      result.githubContributedRepositoryCount.repositoriesContributedTo.nodes,
    );
    const totalOpenSourceRepositories = openSourceRepositories.length;

    return {
      githubContributedRepositoryCount: totalOpenSourceRepositories,
    };
  }
}

/**
 * Represents the object returned by the github graphql api.
 */
export interface githubContributedRepositoryCountResult extends GithubResponse {
  githubContributedRepositoryCount: {
    repositoriesContributedTo: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface githubContributedRepositoryCountData extends GithubData {
  githubContributedRepositoryCount: number;
}
