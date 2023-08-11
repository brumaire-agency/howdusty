import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { GithubTestingModule } from '@/github';
import { OnlydustTestingModule } from '@/onlydust';
import { MetricsRepositoryMock } from './metrics.repository.mocks';
import { Metrics } from './metrics.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors/contributor.factory';
import { MetricsFactory } from '@/metrics/metrics.factory';

describe('MetricsService', () => {
  let metricsService: MetricsService;
  let metricsRepository: MetricsRepositoryMock;

  const METRICS_REPOSITORY_TOKEN = getRepositoryToken(Metrics);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubTestingModule, OnlydustTestingModule],
      providers: [
        MetricsService,
        {
          provide: METRICS_REPOSITORY_TOKEN,
          useClass: MetricsRepositoryMock,
        },
      ],
    }).compile();

    metricsService = module.get(MetricsService);
    metricsRepository = module.get(METRICS_REPOSITORY_TOKEN);
  });

  describe('getMetricsForUsers', () => {
    it('should return metrics for users', async () => {
      expect(
        await metricsService.getMetricsForUsers(['username']),
      ).toStrictEqual({
        username: {
          githubActiveContributionWeeks: 4,
          githubContributedRepositoryCount: 6,
          githubIssuePullRequestRatio: 0.01,
          githubMaintainedRepositoryCount: 5,
          githubTotalIssues: 304,
          githubTotalPullRequests: 618,
          onlydustCollectedGrant: 100,
          onlydustMeanGrantPerProject: 10,
          onlydustContributedProjectCount: 5,
          onlydustContributionCount: 20,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of metrics', async () => {
      const contributors = ContributorFactory.generateMany(2);
      for (const contributor of contributors) {
        const metrics = MetricsFactory.generate({ contributor });
        await metricsService.save(metrics);
      }

      expect(await metricsService.findAll()).toEqual(
        metricsRepository.contributorsMetrics,
      );
    });
  });

  describe('save', () => {
    it("should add a new metrics if it doesn't exist", async () => {
      faker.seed(42);
      const contributor = ContributorFactory.generate();
      const metrics = MetricsFactory.generate({ contributor });
      expect(metricsRepository.contributorsMetrics.length).toBe(0);
      await metricsService.save(metrics);
      expect(metricsRepository.contributorsMetrics.length).toBe(1);
      expect(metricsRepository.contributorsMetrics[0]).toStrictEqual(metrics);
    });

    it('should update a metrics if it does exist', async () => {
      faker.seed(42);
      const metrics = MetricsFactory.generate({ id: '1' });
      const updatedMetrics = MetricsFactory.generate({ id: '1' });
      metricsRepository.contributorsMetrics.push(metrics);

      expect(metricsRepository.contributorsMetrics.length).toBe(1);
      await metricsService.save(updatedMetrics);
      expect(metricsRepository.contributorsMetrics.length).toBe(1);
      expect(metricsRepository.contributorsMetrics[0]).toStrictEqual(
        updatedMetrics,
      );
    });
  });
});
