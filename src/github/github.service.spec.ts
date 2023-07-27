import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { GithubApiMock } from './github.api.mock';
import { GithubApi } from './github.api';
import { GithubService } from './github.service';
import { MetricName } from '@/metrics';

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
        id: '7d02e642-ac46-4838-8920-fdc7f6ee9be5',
        username: 'username',
        name: 'Rosemarie Rogahn',
        avatarUrl: 'https://avatars.githubusercontent.com/u/53969213',
      });
    });
  });

  describe('getMetricsForUser', () => {
    it('should return a User with metrics', async () => {
      const metrics = Object.values(MetricName) as MetricName[];
      expect(await github.getMetricsForUser('username', metrics)).toStrictEqual(
        {
          totalContributions: 618,
          contributedRepositoryCount: 3,
          maintainedRepositoryCount: 6,
          issuePullRequestRatio: 0.52,
          activeContributionWeeks: 0,
        },
      );
    });
  });
});
