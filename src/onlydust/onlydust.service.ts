import { Injectable } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';

@Injectable()
export class OnlydustService {
  constructor(private api: OnlydustApi) {}

  async getUsers() {
    return await this.api.getUsers();
  }

  async getMetricsForAll(usernames: string[]) {
    const onlydustCollectedGrants = await this.api.getonlydustCollectedGrants(
      usernames,
    );
    const onlydustMeanGrantPerProject =
      await this.api.getonlydustMeanGrantPerProject(usernames);
    const onlydustContributedProjectCount =
      await this.api.getonlydustContributedProjectCount(usernames);
    const onlydustContributionCount =
      await this.api.getonlydustContributionCount(usernames);
    const allMetrics = {
      ...onlydustCollectedGrants,
      ...onlydustMeanGrantPerProject,
      ...onlydustContributedProjectCount,
      ...onlydustContributionCount,
    };
    return allMetrics;
  }
}
