import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contributor } from './contributor.entity';
import { ContributorsService } from './contributors.service';
import { ContributorsRepositoryMock } from './contributors.repository.mock';
import { faker } from '@faker-js/faker';
import { ContributorFactory } from '@/contributors/contributor.factory';
import { ContributorDto } from './contributor.dto';

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
      await contributorsRepository.save(ContributorFactory.generateMany(10));
      expect(await contributorsService.findAll()).toEqual(
        contributorsRepository.contributors.map((contributor: Contributor) => {
          const { metric, ...rest } = contributor;
          return {
            ...rest,
            ...metric,
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
      await contributorsRepository.save([expectedContributor]);
      const contributor = await contributorsService.findOneByUsername('john');
      const { metric, ...rest } = expectedContributor;
      const newExpectedContributor = {
        ...rest,
        ...metric,
      };
      expect(newExpectedContributor).toEqual(contributor);
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
});
