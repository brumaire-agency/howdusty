import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { GithubApiMock } from './github.api.mock';
import { GithubApi } from './github.api';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let github: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [
        GithubService,
        { provide: GithubApi, useClass: GithubApiMock },
      ],
    }).compile();

    github = module.get<GithubService>(GithubService);
  });

  describe('getContributorInfo', () => {
    it('should return a User', async () => {
      expect(await github.getContributorInfo('username')).toStrictEqual({
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

  describe('getMetricsForUser', () => {
    it('should return a User with metrics', async () => {
      expect(await github.getContributorInfo('username')).toStrictEqual({
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
