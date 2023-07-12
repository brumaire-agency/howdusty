import {
  OnlydustData,
  OnlydustQuery,
  OnlydustResponse,
} from '../onlydust.query';

export class CollectedGrantQuery extends OnlydustQuery<
  CollectedGrantResult,
  OnlydustData
> {
  request(usernames: string[]): string {
    const usernamesList = usernames.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (accumulator.length ? ', ' : '') +
        "'" +
        currentValue +
        "'",
      '',
    );

    return `
      SELECT id, login, SUM(money_granted) AS collected_grant
      FROM (
        SELECT users.id, users.login, payments.money_granted
        FROM public.github_users AS users 
        LEFT JOIN public.payment_stats AS payments 
        ON users.id = payments.github_user_id
        WHERE users.login IN (${usernamesList})
      ) AS onlydust
      GROUP BY id, login
    `;
  }

  parseResult(result: CollectedGrantResult): CollectedGrantData {
    return result.map((item) => ({
      username: item.login,
      collectedGrant: item.collected_grant ? item.collected_grant : 0,
    }));
  }
}

/**
 * Represents the object returned by the onlydust request.
 */
export interface CollectedGrantResult extends OnlydustResponse {
  id: string;
  login: string;
  collected_grant: null | number;
}

/**
 * Represents the data associated with the metric.
 */
export interface CollectedGrantData extends OnlydustData {
  username: string;
  collectedGrant: number;
}
