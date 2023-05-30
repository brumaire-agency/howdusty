import { Test, TestingModule } from '@nestjs/testing';
import { ContributorsService } from './contributors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './entity/contributor.entity';
import { Repository } from 'typeorm';

describe('ContributorsService', () => {
  let contributorsService: ContributorsService;
  let contributorsRepository: Repository<Contributor>;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  const mockContributor: Contributor = {
    id: 1,
    username: 'username',
    name: 'John Doe',
    avatarUrl: 'https://avatarurl.com',
  };

  const mockContributors: Contributor[] = [
    mockContributor,
    { ...mockContributor, id: 2 },
    { ...mockContributor, id: 3 },
  ];

  const mockProductRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContributorsService,
        {
          provide: CONTRIBUTOR_REPOSITORY_TOKEN,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    contributorsService = module.get<ContributorsService>(ContributorsService);
    contributorsRepository = module.get<Repository<Contributor>>(
      CONTRIBUTOR_REPOSITORY_TOKEN,
    );
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      jest
        .spyOn(contributorsService, 'findAll')
        .mockResolvedValue(mockContributors);
      expect(await contributorsService.findAll()).toBe(mockContributors);
    });
  });
});
