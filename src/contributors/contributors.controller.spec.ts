import { Test, TestingModule } from '@nestjs/testing';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';
import { Contributor } from './interface/contributor.interface';

describe('ContributorsController', () => {
  let contributorController: ContributorsController;
  let contributorService: ContributorsService;

  const mockContributor: Contributor = {
    id: 1,
    username: 'username',
    name: 'John Doe',
    avatar_url: 'https://avatarurl.com',
  };

  const mockContributors: Contributor[] = [
    mockContributor,
    { ...mockContributor, id: 2 },
    { ...mockContributor, id: 3 },
  ];

  const mockContributorService = {
    findAll: jest.fn().mockImplementation(() => mockContributors),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ContributorsController],
      providers: [ContributorsService],
    })
      .overrideProvider(ContributorsService)
      .useValue(mockContributorService)
      .compile();
    contributorService =
      moduleRef.get<ContributorsService>(ContributorsService);
    contributorController = moduleRef.get<ContributorsController>(
      ContributorsController,
    );
  });

  describe('findAll', () => {
    it('should return an array of contributors', async () => {
      expect(await contributorController.findAll()).toEqual(mockContributors);
    });
  });
});
