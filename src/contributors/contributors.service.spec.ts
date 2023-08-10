import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors/contributor.factory';
import { SynchronizationTestingModule } from '@/synchronization';
import { MetricsTestingModule } from '@/metrics';
import { ContributorDto } from './contributor.dto';

describe('ContributorsService', () => {
  let contributorsService: ContributorsService;
  let contributorsRepository: ContributorsRepositoryMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetricsTestingModule, SynchronizationTestingModule],
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
      await contributorsRepository.save(ContributorFactory.generateMany(10));
      expect(await contributorsService.findAll()).toEqual(
        contributorsRepository.contributors.map((contributor: Contributor) => {
          const { metrics, ...rest } = contributor;
          return {
            ...rest,
            ...metrics,
          };
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a contributor', async () => {
      const expectedContributor = {
        id: 'MDQ6VX',
        username: 'john',
        name: 'john doe',
        avatarUrl: 'https://avatars.gi',
        score: 123,
        rank: 12,
      };
      await contributorsRepository.save([expectedContributor]);
      const contributor = await contributorsService.findOneByUsername('john');
      expect(expectedContributor).toEqual(contributor);
    });

    it('should return undefined for non-existing contributor', async () => {
      const response = await contributorsService.findOneByUsername('bob');
      expect(response).toBeNull();
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
      const contributor = ContributorFactory.generateContributorInfo({
        id: '1',
      });
      const updatedContributor = ContributorFactory.generateContributorInfo({
        id: '1',
      });
      contributorsRepository.contributors.push(contributor);

      expect(contributorsRepository.contributors.length).toBe(1);
      await contributorsService.save(updatedContributor);
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual(
        updatedContributor,
      );
    });
  });

  describe('addContributor', () => {
    it("should add a new contributor if it doesn't exist return this contibutor", async () => {
      expect(contributorsRepository.contributors.length).toBe(0);
      const username = 'john_doe';
      const response = await contributorsService.addContributor(username);

      expect(contributorsRepository.contributors.length).toBe(1);
      expect(response.username).toEqual(username);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('avatarUrl');
      expect(response).toHaveProperty('rank');
      expect(response).toHaveProperty('score');
    });

    it('should return a contributor if it does exist', async () => {
      expect(contributorsRepository.contributors.length).toBe(0);
      const username = 'john_doe';
      const response = await contributorsService.addContributor(username);

      expect(contributorsRepository.contributors.length).toBe(1);

      const newResponse = await contributorsService.addContributor(username);
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(response).toEqual(newResponse);
    });
  });
});
