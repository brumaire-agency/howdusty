import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { GithubTestingModule } from '@/github';
import { OnlydustTestingModule } from '@/onlydust';
import { MetricsRepositoryMock } from './metrics.repository.mocks';
import { Metrics } from './metrics.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors/contributor.factory';

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
          totalContributions: 139,
          contributedRepositoryCount: 0,
          maintainedRepositoryCount: 3,
          issuePullRequestRatio: 0.97,
          activeContributionWeeks: 4,
          collectedGrant: 100,
          meanGrantPerProject: 10,
          contributedProjectCount: 5,
          missionCount: 20,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      const contributorInfo = ContributorFactory.generateManyUserInfo(2);
      const contributors = ContributorFactory.generateManyContributorMetrics(
        contributorInfo.length,
        contributorInfo,
      );
      await metricsService.save(contributors);
      expect(await metricsService.findAll()).toEqual(
        metricsRepository.contributorsMetrics.map((item: Metrics) => {
          const { contributor, ...rest } = item;
          return {
            ...contributor,
            ...rest,
          };
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a contributor', async () => {
      const expectedContributor = {
        id: 'MDQ6VX',
        activeContributionWeeks: 5,
        contributedRepositoryCount: 10,
        issuePullRequestRatio: 0.8,
        maintainedRepositoryCount: 3,
        totalContributions: 50,
        collectedGrant: 1000,
        meanGrantPerProject: 500,
        contributedProjectCount: 5,
        missionCount: 20,
        contributor: {
          id: 'MDQ6VX',
          username: 'john',
          name: 'john doe',
          avatarUrl: 'https://avatars.gi',
          score: 123,
          rank: 12,
        },
      };
      await metricsService.save([expectedContributor]);
      const response = await metricsService.findOneByUsername('john');
      const { contributor, ...rest } = expectedContributor;
      expect(response).toEqual({
        ...rest,
        ...contributor,
      });
    });

    it('should return undefined for non-existing contributor', async () => {
      const response = await metricsService.findOneByUsername('bob');
      expect(response).toBeNull();
    });
  });

  describe('save', () => {
    it("should add a new contributor if it doesn't exist", async () => {
      faker.seed(42);
      const contributorInfo = ContributorFactory.generateUserInfo();
      const contributor =
        ContributorFactory.genrerateContributorMetrics(contributorInfo);

      expect(metricsRepository.contributorsMetrics.length).toBe(0);
      await metricsService.save(contributor);
      expect(metricsRepository.contributorsMetrics.length).toBe(1);
      expect(metricsRepository.contributorsMetrics[0]).toStrictEqual(
        contributor,
      );
    });
    it('should update a contributor if it does exist', async () => {
      faker.seed(42);
      const contributorInfo = ContributorFactory.generateUserInfo({ id: '1' });
      const contributor = ContributorFactory.genrerateContributorMetrics(
        contributorInfo,
        { id: '1' },
      );
      const updatedContributor = ContributorFactory.genrerateContributorMetrics(
        contributorInfo,
        { id: '1' },
      );
      metricsRepository.contributorsMetrics.push(contributor);

      expect(metricsRepository.contributorsMetrics.length).toBe(1);
      await metricsService.save(updatedContributor);
      expect(metricsRepository.contributorsMetrics.length).toBe(1);
      expect(metricsRepository.contributorsMetrics[0]).toStrictEqual(
        updatedContributor,
      );
    });
  });
});
