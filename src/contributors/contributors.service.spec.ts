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

  describe('create', () => {
    it('should add a new contributor', async () => {
      expect(contributorsRepository.contributors.length).toBe(1);
      await contributorsService.create(contributorsRepository.newContributor);
      expect(contributorsRepository.contributors.length).toBe(2);
      expect(contributorsRepository.contributors[1]).toStrictEqual({
        id: 2,
        ...contributorsRepository.newContributor,
      });
    });
  });

  describe('update', () => {
    it('should update a contributor', async () => {
      expect(contributorsRepository.contributors.length).toBe(1);
      await contributorsService.update(
        1,
        contributorsRepository.newContributor,
      );
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual({
        id: 1,
        ...contributorsRepository.newContributor,
      });
    });
  });
});
