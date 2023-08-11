import { Metrics } from './metrics.entity';
import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors';
import { MetricName } from '@/metrics/metric-name';

export class MetricsFactory {
  /**
   * Generates a metrics from a preset
   */
  public static generate(preset: Partial<Metrics> = {}): Metrics {
    return Object.assign(
      {
        id: faker.string.uuid(),
        [MetricName.totalPullRequests]: faker.number.int(1000),
        [MetricName.totalIssues]: faker.number.int(1000),
        [MetricName.contributedRepositoryCount]: faker.number.int(10),
        [MetricName.maintainedRepositoryCount]: faker.number.int(10),
        [MetricName.issuePullRequestRatio]: faker.number.float({
          min: 0.01,
          max: 0.99,
          precision: 0.01,
        }),
        [MetricName.activeContributionWeeks]: faker.number.int(10),
        [MetricName.collectedGrant]: faker.number.int(5000),
        [MetricName.meanGrantPerProject]: faker.number.int(500),
        [MetricName.contributedProjectCount]: faker.number.int(10),
        [MetricName.missionCount]: faker.number.int(20),
        contributor: ContributorFactory.generate(),
      } as Metrics,
      preset,
    );
  }

  /**
   * Generates a set of contributors of the given length.
   */
  public static generateMany(
    count: number,
    preset: Partial<Metrics> = {},
  ): Metrics[] {
    return Array.from(new Array(count)).map(() =>
      MetricsFactory.generate(preset),
    );
  }
}
