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
        [MetricName.githubTotalPullRequests]: faker.number.int(1000),
        [MetricName.githubTotalIssues]: faker.number.int(1000),
        [MetricName.githubContributedRepositoryCount]: faker.number.int(10),
        [MetricName.githubMaintainedRepositoryCount]: faker.number.int(10),
        [MetricName.githubIssuePullRequestRatio]: faker.number.float({
          min: 0.01,
          max: 0.99,
          precision: 0.01,
        }),
        [MetricName.githubActiveContributionWeeks]: faker.number.int(10),
        [MetricName.onlydustCollectedGrant]: faker.number.int(5000),
        [MetricName.onlydustMeanGrantPerProject]: faker.number.int(500),
        [MetricName.onlydustContributedProjectCount]: faker.number.int(10),
        [MetricName.onlydustContributionCount]: faker.number.int(20),
        [MetricName.onlydustRegularity]: faker.number.int(15),
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
