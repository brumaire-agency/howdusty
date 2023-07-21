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
   * Gets collectedGrant for all users from OnlyDust.
   */
  async getCollectedGrants(
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
      collectedGrant: result.rows.reduce(
        (record, item) => ({
          ...record,
          [item.login]: item.collected_grant ? item.collected_grant : 0,
        }),
        {},
      ),
    };
  }

  /**
   * Gets the number of missions each contributor.
   */
  async getMissionCount(
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
      SELECT users.id, users.login, SUM(projects.link_count) as mission_count
      FROM public.github_users AS users
      LEFT JOIN public.projects_contributors AS projects
      ON users.id = projects.github_user_id
      WHERE users.login IN (${usernamesList})
      GROUP BY users.id, users.login
    `);

    await client.end();

    return {
      missionCount: result.rows.reduce(
        (record, item) => ({
          ...record,
          [item.login]: item.mission_count ? item.mission_count : 0,
        }),
        {},
      ),
    };
  }

  private async getClient(): Promise<Client> {
    const client = new Client(this.clientConfig);
    await client.connect();
    return client;
  }
}
