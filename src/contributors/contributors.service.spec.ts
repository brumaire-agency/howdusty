import { Test, TestingModule } from '@nestjs/testing';
import { ContributorsService } from './contributors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './entity/contributor.entity';
import { ContributorsRepositoryMock } from './contributors.repository.mock';

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

    contributorsService = module.get<ContributorsService>(ContributorsService);
    contributorsRepository = module.get<ContributorsRepositoryMock>(
      CONTRIBUTOR_REPOSITORY_TOKEN,
    );
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
      expect(contributorsRepository.contributors.length).toBe(1);
      await contributorsService.save(contributorsRepository.newContributor);
      expect(contributorsRepository.contributors.length).toBe(2);
      expect(contributorsRepository.contributors[1]).toStrictEqual({
        id: 2,
        ...contributorsRepository.newContributor,
      });
    });
    it('should update a contributor if it does exist', async () => {
      expect(contributorsRepository.contributors.length).toBe(1);
      await contributorsService.save({
        ...contributorsRepository.newContributor,
        id: contributorsRepository.contributors[0].id,
      });
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual({
        ...contributorsRepository.newContributor,
        id: contributorsRepository.contributors[0].id,
      });
    });
  });
});
