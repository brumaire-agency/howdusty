import { GithubData, GithubQuery, GithubResponse } from '../github.query';
import { getOpenSourceRepositories, RepositoryQuery } from '../helpers';

export class ContributedRepositoryCountQuery extends GithubQuery<
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
export interface ContributedRepositoryCountResult extends GithubResponse {
  contributedRepositoryCount: {
    repositoriesContributedTo: {
      nodes: RepositoryQuery[];
    };
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface ContributedRepositoryCountData extends GithubData {
  contributedRepositoryCount: number;
}
