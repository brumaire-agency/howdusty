import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { GithubTestingModule } from '@/github';

describe('MetricsService', () => {
  let metrics: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubTestingModule],
      providers: [MetricsService],
    }).compile();

    metrics = module.get(MetricsService);
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
        },
      });
    });
  });
});
