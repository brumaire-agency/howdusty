import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Contributor } from './contributor.entity';
import { ContributorFactory } from './contributor.factory';
import { ContributorsController } from './contributors.controller';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { ContributorsService } from './contributors.service';
import { Metrics, MetricsService, MetricsTestingModule } from '@/metrics';
import { MetricsRepositoryMock } from '@/metrics/metrics.repository.mocks';

describe('ContributorsController', () => {
  let controller: ContributorsController;
  let metricsRepository: MetricsRepositoryMock;
  let metricsService: MetricsService;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);
  const METRICS_REPOSITORY_TOKEN = getRepositoryToken(Metrics);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetricsTestingModule],
      providers: [
        ContributorsService,
        {
          provide: CONTRIBUTOR_REPOSITORY_TOKEN,
          useClass: ContributorsRepositoryMock,
        },
        {
          provide: METRICS_REPOSITORY_TOKEN,
          useClass: MetricsRepositoryMock,
        },
      ],
      controllers: [ContributorsController],
    }).compile();

    controller = module.get(ContributorsController);
    metricsRepository = module.get(METRICS_REPOSITORY_TOKEN);
    metricsService = module.get(MetricsService);
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      faker.seed(42);
      const contributorInfo = ContributorFactory.generateManyUserInfo(2);
      const contributors = ContributorFactory.generateManyContributorMetrics(
        contributorInfo.length,
        contributorInfo,
      );
      await metricsService.save(contributors);
      const response = await controller.findAll();
      expect(response.length).toEqual(2);
      expect(response).toEqual(
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
      const response = await controller.findOneByUsername('john');
      const { contributor, ...rest } = expectedContributor;
      expect(response).toEqual({
        ...rest,
        ...contributor,
      });
    });

    it('should return 404 error for non-existing contributor', async () => {
      try {
        await controller.findOneByUsername('bob');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        const exceptionResponse = error.getResponse();
        expect(exceptionResponse.statusCode).toBe(404);
        expect(exceptionResponse.message).toBe('Contributor not found');
      }
    });
  });
});
