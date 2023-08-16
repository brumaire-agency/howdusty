import { Injectable } from '@nestjs/common';
import { OnlydustApi } from './onlydust.api';

@Injectable()
export class OnlydustService {
  constructor(private api: OnlydustApi) {}

  async getUsers() {
    return await this.api.getUsers();
  }

  async getMetricsForAll(usernames: string[]) {
    const onlydustCollectedGrants = await this.api.getOnlydustCollectedGrants(
      usernames,
    );
    const onlydustMeanGrantPerProject =
      await this.api.getOnlydustMeanGrantPerProject(usernames);
    const onlydustContributedProjectCount =
      await this.api.getOnlydustContributedProjectCount(usernames);
    const onlydustContributionCount =
      await this.api.getOnlydustContributionCount(usernames);
    const onlydustRegularity = await this.api.getOnlydustRegularity(usernames);
    const allMetrics = {
      ...onlydustCollectedGrants,
      ...onlydustMeanGrantPerProject,
      ...onlydustContributedProjectCount,
      ...onlydustContributionCount,
      ...onlydustRegularity,
    };
    return allMetrics;
  }
}
