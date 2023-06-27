import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class OnlydustApi {
  constructor(private readonly config: ConfigService) {}

  /**
   * Gets users from OnlyDust.
   */
  async getUsers() {
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

    const res = await client.query('SELECT NOW()');
    console.log(res);
    await client.end();
  }
}
