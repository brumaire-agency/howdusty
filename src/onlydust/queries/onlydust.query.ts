/**
 * Represents an object returned by a graphql api.
 */
export type OnlydustResponse = Record<string, any>;

/**
 * Represents the data associated with a given metric.
 */
export type OnlydustData = Record<string, number | string>;

/**
 * A GraphQL query.
 */
export abstract class OnlydustQuery<
  T extends OnlydustResponse = OnlydustResponse,
  U extends OnlydustData = OnlydustData,
> {
  /**
   * Builds a request.
   */
  abstract request(usernames?: string[]): string;

  /**
   * Parses the query result into an exploitable.
   */
  abstract parseResult(result: T): U;
}

/**
 * A list of GraphQL queries
 */
export type OnlydustQueries = {
  [name: string]: OnlydustQuery;
};
