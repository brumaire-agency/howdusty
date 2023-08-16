import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientConfig } from 'pg';
import { OnlydustUser } from './types';

@Injectable()
export class OnlydustApi {
  private readonly clientConfig: ClientConfig;

  constructor(private readonly config: ConfigService) {
    const { host, port, database, username, password } =
      this.config.get('onlydust');

    this.clientConfig = {
      user: username,
      host: host,
      database: database,
      password: password,
      port: port,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  /**
   * Gets all users from OnlyDust.
   */
  async getUsers(): Promise<OnlydustUser[]> {
    const client = await this.getClient();

    const result = await client.query(
      'SELECT id, login FROM "public"."github_users"',
    );

    await client.end();

    return result.rows;
  }

  /**
   * Gets onlydustCollectedGrant for all users from OnlyDust.
   */
  async getOnlydustCollectedGrants(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    const client = await this.getClient();

    const usernamesList = usernames.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (accumulator.length ? ', ' : '') +
        "'" +
        currentValue +
        "'",
      '',
    );

    const result = await client.query(`
      SELECT id, login, SUM(money_granted) AS collected_grant
      FROM (
        SELECT users.id, users.login, payments.money_granted
        FROM public.github_users AS users 
        LEFT JOIN public.payment_stats AS payments 
        ON users.id = payments.github_user_id
        WHERE users.login IN (${usernamesList})
      ) AS onlydust
      GROUP BY id, login
    `);

    await client.end();

    return {
      onlydustCollectedGrant: result.rows.reduce(
        (record, item) => ({
          ...record,
          [item.login]: item.collected_grant ? item.collected_grant : 0,
        }),
        {},
      ),
    };
  }

  /**
   * Gets the mean of collected grants per project for all users from OnlyDust.
   */
  async getOnlydustMeanGrantPerProject(
    usernames: string[],
  ): Promise<Record<string, number>> {
    const client = await this.getClient();

    const usernamesList = usernames.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (accumulator.length ? ', ' : '') +
        "'" +
        currentValue +
        "'",
      '',
    );

    const result = await client.query(`
      SELECT users.id, users.login, COUNT(projects.id) AS project_count, SUM(payments.money_granted) AS total_grants
      FROM public.github_users AS users 
      LEFT JOIN public.payment_stats AS payments 
      ON users.id = payments.github_user_id
      LEFT JOIN public.projects AS projects
      ON payments.project_id = projects.id
      WHERE users.login IN (${usernamesList})
      GROUP BY users.id, users.login
    `);

    await client.end();

    return {
      onlydustMeanGrantPerProject: result.rows.reduce(
        (record, item) => ({
          ...record,
          [item.login]: item.total_grants
            ? item.total_grants / item.project_count
            : 0,
        }),
        {},
      ),
    };
  }

  /**
   * Gets the number of unique projects each contributor has contributed to.
   */
  async getOnlydustContributedProjectCount(
    usernames: string[],
  ): Promise<Record<string, number>> {
    const client = await this.getClient();

    const query = `
      SELECT users.id, users.login, Count(projects.github_user_id) as project_count
      FROM public.github_users AS users
      LEFT JOIN public.projects_contributors AS projects
      ON users.id = projects.github_user_id
      WHERE users.login = ANY($1)
      GROUP BY users.id, users.login
    `;

    const result = await client.query(query, [usernames]);

    await client.end();

    return {
      onlydustContributedProjectCount: result.rows.reduce(
        (record, item) => ({
          ...record,
          [item.login]: item.project_count || 0,
        }),
        {},
      ),
    };
  }

  /**
   * Gets the number of missions each contributor.
   */
  async getOnlydustContributionCount(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    const client = await this.getClient();

    const query = `
      SELECT users.id, users.login, SUM(projects.link_count) as contribution_count
      FROM public.github_users AS users
      LEFT JOIN public.projects_contributors AS projects
      ON users.id = projects.github_user_id
      WHERE users.login = ANY($1)
      GROUP BY users.id, users.login
    `;

    const result = await client.query(query, [usernames]);

    await client.end();

    return {
      onlydustContributionCount: result.rows.reduce(
        (record, item) => ({
          ...record,
          [item.login]: item.contribution_count ? item.contribution_count : 0,
        }),
        {},
      ),
    };
  }

  /**
   * Gets the frequency of contributions each contributor.
   */

  async getOnlydustRegularity(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    const client = await this.getClient();

    const query = `
    SELECT users.id, users.login,
    DATE_TRUNC('month', COALESCE(issues.created_at, pull_requests.created_at, code_reviews.submitted_at)) as month,
    COUNT(COALESCE(issues.id, pull_requests.id, code_reviews.pull_request_id)) as contribution_count
    FROM public.github_users AS users
    LEFT JOIN public.contributions AS contributions
    ON users.id = contributions.user_id
    LEFT JOIN public.github_issues AS issues
    ON contributions.details_id = issues.id AND contributions.type = 'issue'
    LEFT JOIN public.github_pull_requests AS pull_requests
    ON contributions.details_id = pull_requests.id AND contributions.type = 'pull_request'
    LEFT JOIN public.github_pull_request_reviews AS code_reviews
    ON contributions.details_id = code_reviews.pull_request_id AND contributions.type = 'code_review'
    WHERE users.login = ANY($1)
      AND COALESCE(issues.created_at, pull_requests.created_at, code_reviews.submitted_at) >= CURRENT_DATE - INTERVAL '11 months'
    GROUP BY users.id, users.login, month
    `;

    const result = await client.query(query, [usernames]);

    await client.end();

    const constributions: Record<string, Record<string, number>> = {};

    result.rows.forEach((row) => {
      const { login, month, contribution_count } = row;

      constributions[login] = constributions[login] || {};
      constributions[login][month.toISOString()] = contribution_count;
    });

    const contributorsRegularity: Record<string, number> = {};

    Object.keys(constributions).forEach((contributor) => {
      const contribution = constributions[contributor];

      const maxMonths = 12;
      let regularity = 0;
      const sumOfMonths = (maxMonths * (maxMonths + 1)) / 2;

      const currentDate = new Date();
      for (const month in contribution) {
        const monthDate = new Date(month);
        const monthsDiff =
          (currentDate.getFullYear() - monthDate.getFullYear()) * 12 +
          currentDate.getMonth() -
          monthDate.getMonth();
        const monthWeight = maxMonths - monthsDiff;
        regularity += (contribution[month] * monthWeight) / sumOfMonths;
      }

      contributorsRegularity[contributor] = regularity;
    });

    return {
      onlydustRegularity: contributorsRegularity,
    };
  }

  private async getClient(): Promise<Client> {
    const client = new Client(this.clientConfig);
    await client.connect();
    return client;
  }
}
