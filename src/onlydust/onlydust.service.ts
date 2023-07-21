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
    const contributedProjectCount = await this.api.getContributedProjectCount(
      usernames,
    );
    const allMetrics = { ...collectedGrants, ...contributedProjectCount };

    return allMetrics;
  }
}
