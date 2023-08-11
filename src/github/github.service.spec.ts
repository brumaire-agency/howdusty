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
        id: 'd02e642a-c468-4389-a20f-dc7f6ee9be51',
        username: 'username',
        name: 'Miss Shelia Lindgren',
        avatarUrl: 'https://avatars.githubusercontent.com/u/35675332',
      });
    });
  });

  describe('getMetricsForUser', () => {
    it('should return a User with metrics', async () => {
      const metrics = Object.values(MetricName) as MetricName[];
      expect(await github.getMetricsForUser('username', metrics)).toStrictEqual(
        {
          activeContributionWeeks: 4,
          contributedRepositoryCount: 6,
          issuePullRequestRatio: 0.01,
          maintainedRepositoryCount: 5,
          totalIssues: 304,
          totalPullRequests: 618,
        },
      );
    });
  });
});
