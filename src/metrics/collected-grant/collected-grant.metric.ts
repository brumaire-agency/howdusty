import { GithubGraphResponse, Metric, MetricData } from '@/metrics/base.metric';

export class CollectedGrantMetric extends Metric<
  CollectedGrantResult,
  CollectedGrantData
> {
  buildQuery(): string {
    return `
      SELECT id, login, SUM(money_granted) AS collected_grant
      FROM (
        SELECT users.id, users.login, payments.money_granted
        FROM public.github_users AS users 
        LEFT JOIN public.payment_stats AS payments 
        ON users.id = payments.github_user_id
      ) AS onlydust
      GROUP BY id, login
    `;
  }

  parseResult(result: CollectedGrantResult): CollectedGrantData {
    console.log(result);

    return {
      collectedGrant: 500,
    };
  }
}

/**
 * Represents the object returned by the onlydust api.
 */
export interface CollectedGrantResult extends GithubGraphResponse {
  activeContributionWeeks: {
    contributionsCollection: string;
  };
}

/**
 * Represents the data associated with the metric.
 */
export interface CollectedGrantData extends MetricData {
  collectedGrant: number;
}
