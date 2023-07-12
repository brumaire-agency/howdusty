import { GithubService } from '@/github';
import { Injectable } from '@nestjs/common';
import { MetricName } from './metric-name';
import { OnlydustService } from '@/onlydust';

@Injectable()
export class MetricsService {
  constructor(
    private github: GithubService,
    private onlydust: OnlydustService,
  ) {}

  async getMetricsForUsers(
    usernames: string[],
    metrics: MetricName[] = [],
  ): Promise<Record<string, Record<string, number>>> {
    if (metrics.length === 0) {
      metrics = Object.values(MetricName) as MetricName[];
    }

    // Get github metrics
    // const githubMetrics = await usernames.reduce(
    //   async (accumulator, username) => {
    //     const metricsForUser = await this.github.getMetricsForUser(
    //       username,
    //       metrics,
    //     );
    //     return { ...(await accumulator), [username]: metricsForUser };
    //   },
    //   Promise.resolve({}),
    // );

    // TODO: get onlydust metrics
    const onlydustMetrics = await this.onlydust.getMetricForAll(
      usernames,
      metrics,
    );
    console.log(onlydustMetrics);

    // TODO: aggregate metrics and return it

    return {};
  }
}
