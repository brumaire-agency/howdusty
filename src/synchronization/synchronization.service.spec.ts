import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Contributor,
  ContributorsRepositoryMock,
  ContributorsService,
} from '@/contributors';
import { GithubApiMock, GithubApi, GithubService } from '@/github';
import { SynchronizationService } from './synchronization.service';

describe('SynchronizationService', () => {
  let synchronization: SynchronizationService;
  let contributorsRepository: ContributorsRepositoryMock;
  let githubApi: GithubApiMock;

  const CONTRIBUTOR_REPOSITORY_TOKEN = getRepositoryToken(Contributor);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        SynchronizationService,
        ContributorsService,
        {
          provide: CONTRIBUTOR_REPOSITORY_TOKEN,
          useClass: ContributorsRepositoryMock,
        },
        GithubService,
        {
          provide: GithubApi,
          useClass: GithubApiMock,
        },
      ],
    }).compile();

    synchronization = module.get<SynchronizationService>(
      SynchronizationService,
    );
    contributorsRepository = module.get<ContributorsRepositoryMock>(
      CONTRIBUTOR_REPOSITORY_TOKEN,
    );
    githubApi = module.get<GithubApiMock>(GithubApi);
  });

  describe('githubUser', () => {
    it("should add a new contributor if it doesn't exist", async () => {
      expect(contributorsRepository.contributors.length).toBe(1);
      await synchronization.githubUser(githubApi.user.username);
      expect(contributorsRepository.contributors.length).toBe(2);
      expect(contributorsRepository.contributors[1]).toStrictEqual(
        githubApi.user,
      );
    });
    it('should update a contributor if it does exist', async () => {
      contributorsRepository.contributors = [
        {
          ...contributorsRepository.contributors[0],
          id: githubApi.user.id,
        },
      ];
      expect(contributorsRepository.contributors.length).toBe(1);
      await synchronization.githubUser(githubApi.user.username);
      expect(contributorsRepository.contributors.length).toBe(1);
      expect(contributorsRepository.contributors[0]).toStrictEqual(
        githubApi.user,
      );
    });
  });
});
