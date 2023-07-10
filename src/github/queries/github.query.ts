/**
 * Represents an object returned by a graphql api.
 */
export type GithubResponse = Record<string, any>;

/**
 * Represents the data associated with a given metric.
 */
export type GithubData = Record<string, number | string>;

/**
 * A GraphQL query.
 */
export abstract class GithubQuery<
  T extends GithubResponse = GithubResponse,
  U extends GithubData = GithubData,
> {
  /**
   * Builds a query.
   */
  abstract buildQuery(username: string): string;

  /**
   * Parses the query result into an exploitable.
   */
  abstract parseResult(result: T): U;
}
