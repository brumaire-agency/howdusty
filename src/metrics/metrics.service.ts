import { GithubService, User } from '@/github';
import { Injectable } from '@nestjs/common';
import { MetricName } from './metric-name';
import { OnlydustService } from '@/onlydust';
import { Metrics } from './metrics.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contributor, ContributorDto } from '@/contributors';

@Injectable()
export class MetricsService {
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

  async save(metric) {
    return await this.metricsRepository.save(metric);
  }

  async findAll(): Promise<ContributorDto[]> {
    const results = await this.metricsRepository
      .createQueryBuilder('metrics')
      .leftJoinAndSelect('metrics.contributor', 'contributor')
      .getMany();
    return results.map((item: Metrics) => {
      const { contributor, ...rest } = item;
      return {
        ...contributor,
        ...rest,
      };
    });
  }

  async findOneByUsername(username: string): Promise<ContributorDto> {
    const result = await this.metricsRepository
      .createQueryBuilder('metrics')
      .leftJoinAndSelect('metrics.contributor', 'contributor')
      .where('contributor.username = :username', { username })
      .getOne();

    if (!result) {
      return null;
    }

    const { contributor, ...rest } = result;

    return {
      ...contributor,
      ...rest,
    };
  }
}
