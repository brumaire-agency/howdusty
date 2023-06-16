import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors/contributor.factory';

describe('ContributorsService', () => {
  let contributorsService: ContributorsService;
  let contributorsRepository: ContributorsRepositoryMock;

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
    }).compile();

    contributorsService = module.get(ContributorsService);
    contributorsRepository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      expect(await contributorsService.findAll()).toBe(
        contributorsRepository.contributors,
      );
    });
  });

  describe('save', () => {
    it("should add a new contributor if it doesn't exist", async () => {
      faker.seed(42);
      const contributor = ContributorFactory.generate();

      expect(contributorsRepository.contributors.length).toBe(0);
      await contributorsService.save(contributor);
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual(contributor);
    });
    it('should update a contributor if it does exist', async () => {
      faker.seed(42);
      const contributor = ContributorFactory.generate({ id: '1' });
      const updatedContributor = ContributorFactory.generate({ id: '1' });
      contributorsRepository.contributors.push(contributor);

      expect(contributorsRepository.contributors.length).toBe(1);
      await contributorsService.save(updatedContributor);
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual(
        updatedContributor,
      );
    });
  });
});
