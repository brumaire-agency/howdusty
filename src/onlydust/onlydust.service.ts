import { Injectable } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';

@Injectable()
export class OnlydustService {
  constructor(private api: OnlydustApi) {}

  async getUsers() {
    return await this.api.getUsers();
  }

  async getMetricsForAll(usernames: string[]) {
    const collectedGrants = await this.api.getCollectedGrants(usernames);
    const allMetrics = { ...collectedGrants };

    return allMetrics;
  }
}
