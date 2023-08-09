import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Contributor } from './contributor.entity';
import { ContributorFactory } from './contributor.factory';
import { ContributorsController } from './contributors.controller';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { ContributorsService } from './contributors.service';
import { ScorerModule } from '@/scorer';
import { MetricsTestingModule } from '@/metrics';
import { GithubTestingModule } from '@/github';

describe('ContributorsController', () => {
  let controller: ContributorsController;
  let repository: ContributorsRepositoryMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScorerModule, MetricsTestingModule, GithubTestingModule],
      providers: [
        ContributorsService,
        {
          provide: CONTRIBUTOR_REPOSITORY_TOKEN,
          useClass: ContributorsRepositoryMock,
        },
      ],
      controllers: [ContributorsController],
    }).compile();

    controller = module.get(ContributorsController);
    repository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      faker.seed(42);
      await repository.save(ContributorFactory.generateMany(3));
      const response = await controller.findAll();
      expect(response.length).toEqual(3);
      expect(response).toEqual(
        repository.contributors.map((contributor: Contributor) => {
          const { metrics, ...rest } = contributor;
          return {
            ...rest,
            ...metrics,
          };
        }),
      );
    });
  });

  describe('addContributor', () => {
    it("should add a new contributor if it doesn't exist return this contibutor", async () => {
      expect(repository.contributors.length).toBe(0);
      const username = 'john_doe';
      const response = await controller.addContributor(username);
      console.log(response);
      expect(repository.contributors.length).toBe(1);
      expect(response.username).toEqual(username);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('avatarUrl');
      expect(response).toHaveProperty('rank');
      expect(response).toHaveProperty('score');
    });

    it('should return a contributor if it does exist', async () => {
      expect(repository.contributors.length).toBe(0);
      const username = 'john_doe';
      const response = await controller.addContributor(username);

      expect(repository.contributors.length).toBe(1);

      const newResponse = await controller.addContributor(username);
      expect(repository.contributors.length).toBe(1);
      expect(response).toEqual(newResponse);
    });
  });

  describe('findOne', () => {
    it('should return a contributor', async () => {
      const expectedContributor = {
        id: 'MDQ6VX',
        username: 'john',
        name: 'john doe',
        avatarUrl: 'https://avatars.gi',
        metric: {
          totalContributions: faker.number.int(1000),
          contributedRepositoryCount: faker.number.int(10),
          maintainedRepositoryCount: faker.number.int(10),
          issuePullRequestRatio: faker.number.float({
            min: 0.01,
            max: 0.99,
            precision: 0.01,
          }),
          activeContributionWeeks: faker.number.int(10),
          collectedGrant: faker.number.int(5000),
          meanGrantPerProject: faker.number.int(500),
          contributedProjectCount: faker.number.int(10),
          missionCount: faker.number.int(20),
        },
      };
      await repository.save([expectedContributor]);
      const contributor = await controller.findOneByUsername('john');
      expect(expectedContributor).toEqual(contributor);
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
