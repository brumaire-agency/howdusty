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
        id: 'e642ac46-8389-420f-8dc7-f6ee9be51938',
        username: 'username',
        name: 'Leah McGlynn',
        avatarUrl: 'https://avatars.githubusercontent.com/u/96525532',
      });
    });
  });

  describe('getMetricsForUser', () => {
    it('should return a User with metrics', async () => {
      const metrics = Object.values(MetricName) as MetricName[];
      expect(await github.getMetricsForUser('username', metrics)).toStrictEqual(
        {
          githubActiveContributionWeeks: 4,
          githubContributedRepositoryCount: 6,
          githubIssuePullRequestRatio: 0.01,
          githubMaintainedRepositoryCount: 5,
          githubTotalIssues: 304,
          githubTotalPullRequests: 618,
        },
      );
    });
  });
});
