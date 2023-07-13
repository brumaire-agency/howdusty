import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { OnlydustUser } from './types';

@Injectable()
export class OnlydustApi {
  private client;

  constructor(private readonly config: ConfigService) {
    const { host, port, database, username, password } =
      this.config.get('onlydust');
    this.client = new Client({
      user: username,
      host: host,
      database: database,
      password: password,
      port: port,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Gets all users from OnlyDust.
   */
  async getUsers(): Promise<OnlydustUser[]> {
    await this.client.connect();

    const result = await this.client.query(
      'SELECT id, login FROM "public"."github_users"',
    );

    await this.client.end();

    return result.rows;
  }

  /**
   * Gets collectedGrant for all users from OnlyDust.
   */
  async getCollectedGrants(
    usernames: string[],
  ): Promise<Record<string, Record<string, number>>> {
    const usernamesList = usernames.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (accumulator.length ? ', ' : '') +
        "'" +
        currentValue +
        "'",
      '',
    );

    await this.client.connect();

    const result = await this.client.query(`
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

    await this.client.end();

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
}
