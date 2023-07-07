import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { OnlydustUser } from './types';
import { CollectedGrantMetric } from '@/metrics';

@Injectable()
export class OnlydustApi {
  private collectedGrantMetric: CollectedGrantMetric;

  constructor(private readonly config: ConfigService) {
    this.collectedGrantMetric = new CollectedGrantMetric();
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
      `
      SELECT id, login
      FROM public.github_users
      `,
    );

    await client.end();

    return result.rows;
  }

  async getContributorsInfo(usernames: string[]) {
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

    const collectedGrantResult = await client.query(
      this.collectedGrantMetric.buildQuery(usernames),
    );
    const collectedGrantData = this.collectedGrantMetric.parseResult(
      collectedGrantResult.rows,
    );

    await client.end();

    return collectedGrantData;
  }
}
