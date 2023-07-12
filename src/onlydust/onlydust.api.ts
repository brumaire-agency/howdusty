import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { OnlydustUser } from './types';
import { OnlydustQuery } from './queries/onlydust.query';

@Injectable()
export class OnlydustApi {
  constructor(private readonly config: ConfigService) {}

  /**
   * Gets info from onlydust
   */
  async getInfo(usernames: string[], query: OnlydustQuery) {
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

    const result = await client.query(query.request(usernames));

    await client.end();

    console.log(result.rows);

    // return result.rows;
  }

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
      'SELECT id, login FROM "public"."github_users"',
    );

    await client.end();

    return result.rows;
  }
}
