import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Contributor } from './contributor.entity';
import { ContributorFactory } from './contributor.factory';
import { ContributorsController } from './contributors.controller';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { ContributorsService } from './contributors.service';

describe('ContributorsController', () => {
  let controller: ContributorsController;
  let repository: ContributorsRepositoryMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      expect(response).toEqual(repository.contributors);
    });
  });

  describe('findOne', () => {
    it('should return a contributor', async () => {
      const expectedContributor: Contributor = {
        id: 'MDQ6VX',
        username: 'john',
        name: 'john doe',
        avatarUrl: 'https://avatars.gi',
        activeContributionWeeks: 5,
        contributedRepositoryCount: 10,
        issuePullRequestRatio: 0.8,
        maintainedRepositoryCount: 3,
        totalContributions: 50,
        collectedGrant: 1000,
        meanGrantPerProject: 500,
        contributedProjectCount: 5,
        missionCount: 20,
        score: 123,
        rank: 12,
      };
      await repository.save([expectedContributor]);
      const response = await controller.findOneByUsername('john');
      expect(expectedContributor).toEqual(response);
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
