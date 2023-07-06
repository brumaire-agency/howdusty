import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { OnlydustUser } from './types';

@Injectable()
export class OnlydustApi {
  constructor(private readonly config: ConfigService) {}

  /**
   * Gets all users from OnlyDust.
   */
  async getUsers(): Promise<OnlydustUser[]> {
    const { host, port, database, username, password } =
      this.config.get('onlydust');
    const client = new Client({
      user: username,
      host: host,
      database: database,
      password: password,
      port: port,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();

    const result = await client.query(
      `
      SELECT id, login, SUM(money_granted) AS amount_of_grant
      FROM (
        SELECT users.id, users.login, payments.money_granted
        FROM public.github_users AS users 
        LEFT JOIN public.payment_stats AS payments 
        ON users.id = payments.github_user_id
      ) AS onlydust
      GROUP BY id, login
      `,
    );

    await client.end();

    return result.rows;
  }
}
