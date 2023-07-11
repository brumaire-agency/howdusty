import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contributor,
  ContributorFactory,
  ContributorsRepositoryMock,
} from '@/contributors';
import { SynchronizationService } from './synchronization.service';
import { faker } from '@faker-js/faker';
import { SynchronizationTestingModule } from '@/synchronization/synchronization.testing-module';

describe('SynchronizationService', () => {
  let synchronization: SynchronizationService;
  let contributorsRepository: ContributorsRepositoryMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SynchronizationTestingModule],
    }).compile();

    synchronization = module.get(SynchronizationService);
    contributorsRepository = module.get(CONTRIBUTOR_REPOSITORY_TOKEN);
  });

  describe('synchronizeUser', () => {
    it("should add a new contributor if it doesn't exist", async () => {
      expect(contributorsRepository.contributors.length).toBe(0);
      await synchronization.synchronizeUser('username');
      expect(contributorsRepository.contributors.length).toBe(1);
      console.log(contributorsRepository.contributors[0]);
      expect(contributorsRepository.contributors[0]).toStrictEqual({
        id: '5cf2bc99-2721-407d-8592-ba00fbdf302f',
        username: 'username',
        name: 'Nancy Leffler',
        avatarUrl: 'https://avatars.githubusercontent.com/u/39986098',
        totalContributions: 139,
        contributedRepositoryCount: 0,
        maintainedRepositoryCount: 3,
        issuePullRequestRatio: 0.97,
        activeContributionWeeks: 4,
      });
    });
    it('should update a contributor if it does exist', async () => {
      faker.seed(42);
      const contributor = ContributorFactory.generate({
        username: 'username',
      });
      contributorsRepository.contributors.push(contributor);
      expect(contributorsRepository.contributors.length).toBe(1);
      await synchronization.synchronizeUser('username');
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual({
        id: '5cf2bc99-2721-407d-8592-ba00fbdf302f',
        username: 'username',
        name: 'Nancy Leffler',
        avatarUrl: 'https://avatars.githubusercontent.com/u/39986098',
        totalContributions: 139,
        contributedRepositoryCount: 0,
        maintainedRepositoryCount: 3,
        issuePullRequestRatio: 0.97,
        activeContributionWeeks: 4,
      });
    });
  });
});
