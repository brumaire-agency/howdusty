import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { GithubTestingModule } from '@/github';
import { OnlydustTestingModule } from '@/onlydust';
import { MetricsRepositoryMock } from './metrics.repository.mocks';
import { ContributorsRepositoryMock } from '@/contributors';
import { Metrics } from './metrics.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MetricsService', () => {
  let metrics: MetricsService;
  let repository: ContributorsRepositoryMock;

  const METRICS_REPOSITORY_TOKEN = getRepositoryToken(Metrics);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubTestingModule, OnlydustTestingModule],
      providers: [
        MetricsService,
        {
          provide: METRICS_REPOSITORY_TOKEN,
          useClass: MetricsRepositoryMock,
        },
      ],
    }).compile();

    metrics = module.get(MetricsService);
    repository = module.get(METRICS_REPOSITORY_TOKEN);
  });

  describe('getMetricsForUsers', () => {
    it('should return metrics for users', async () => {
      expect(await metrics.getMetricsForUsers(['username'])).toStrictEqual({
        username: {
          id: '5cf2bc99-2721-407d-8592-ba00fbdf302f',
          username: 'username',
          name: 'Nancy Leffler',
          avatarUrl: 'https://avatars.githubusercontent.com/u/39986098',
          totalContributions: 139,
          contributedRepositoryCount: 0,
          maintainedRepositoryCount: 3,
          issuePullRequestRatio: 0.97,
          activeContributionWeeks: 4,
          collectedGrant: 100,
          meanGrantPerProject: 10,
          contributedProjectCount: 5,
          missionCount: 20,
        },
      });
    });
  });
});
