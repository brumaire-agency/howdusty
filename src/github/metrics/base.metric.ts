/**
 * Represents an object returned by the github graphql api.
 */
export interface GithubGraphResponse {
  data: Record<string, any>;
}

/**
 * Represents the data associated with a given metric.
 */
export type MetricData = Record<string, number | string>;

/**
 * A base metric.
 */
export abstract class Metric<
  T extends GithubGraphResponse = GithubGraphResponse,
  U extends MetricData = MetricData,
> {
  /**
   * Builds a query for fetching the given metric.
   */
  abstract buildQuery(username: string): string;

  /**
   * Parses the query result into an exploitable metric.
   */
  abstract parseResult(result: T): U;
}
