import { GithubService, User } from '@/github';
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

    // Get github metrics sequentially
    const githubMetrics: Record<string, User> = {};
    for (const username of usernames) {
      const metricsForUser = await this.github.getMetricsForUser(
        username,
        metrics,
      );
      githubMetrics[username] = metricsForUser;
    }

    // Get onlydust metrics
    const onlydustMetrics = await this.onlydust.getMetricsForAll(usernames);

    // Aggregate metrics
    const allMetrics = usernames.reduce(
      (record, username) => ({
        ...record,
        [username]: {
          ...githubMetrics[username],
          ...Object.keys(onlydustMetrics).reduce(
            (recordOnlydust, metric) => ({
              ...recordOnlydust,
              [metric]: (onlydustMetrics as object)[metric][username],
            }),
            {},
          ),
        },
      }),
      {},
    );

    return allMetrics;
  }
}
