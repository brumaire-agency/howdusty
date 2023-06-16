import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
});
