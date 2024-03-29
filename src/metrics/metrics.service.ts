import { GithubService, User } from '@/github';
import { Injectable, Logger } from '@nestjs/common';
import { MetricName } from './metric-name';
import { OnlydustService } from '@/onlydust';
import { Metrics } from './metrics.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(Metrics)
    private metricsRepository: Repository<Metrics>,
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
    for (const [index, username] of usernames.entries()) {
      this.logger.log(
        `[${index + 1}/${
          usernames.length
        }] syncing github metrics for user ${username}`,
      );
      const metricsForUser = await this.github.getMetricsForUser(
        username,
        metrics,
      );
      githubMetrics[username] = metricsForUser;
    }

    // Get onlydust metrics
    this.logger.log(`syncing onlydust metrics for every user`);
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
    this.logger.log(`all metrics fetched`);

    return allMetrics;
  }

  async save(metric) {
    return await this.metricsRepository.save(metric);
  }

  async findAll(): Promise<Metrics[]> {
    const results = await this.metricsRepository.find();
    return results;
  }
}
