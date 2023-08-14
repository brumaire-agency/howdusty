import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { Contributor, ContributorsService } from '@/contributors';
import { ScorerService } from '@/scorer';
import { MetricsService, Metrics } from '@/metrics';
import { GithubService } from '@/github';

@Injectable()
export class SynchronizationService {
  private readonly logger = new Logger(SynchronizationService.name);

  constructor(
    @Inject(forwardRef(() => ContributorsService))
    private contributors: ContributorsService,
    private github: GithubService,
    private metrics: MetricsService,
    private scorer: ScorerService,
  ) {}

  async synchronizeUser(username: string): Promise<Contributor> {
    const userInfo = await this.github.getContributorInfo(username);
    const user = { ...userInfo };
    return await this.contributors.save(user);
  }

  async synchronizeUsersMetrics(usernames: string[] = []): Promise<Metrics[]> {
    if (usernames.length === 0) {
      usernames = (await this.contributors.findAll()).map(
        (user) => user.username,
      );
    }

    const metrics: Metrics[] = [];
    const usersMetrics = await this.metrics.getMetricsForUsers(usernames);
    for (const [index, username] of usernames.entries()) {
      this.logger.log(
        `[${index + 1}/${usernames.length}] syncing info for user ${username}`,
      );
      const userInfo = await this.contributors.findOneByUsername(username);
      const user = {
        id: userInfo.id,
        ...usersMetrics[username],
        contributor: userInfo,
      };
      const savedUser = await this.metrics.save(user);
      metrics.push(savedUser);
    }

    return metrics;
  }

  async scoreUsers(): Promise<void> {
    const contributors = await this.contributors.findAll();
    const scoredContributors = this.scorer.score(contributors);
    await this.contributors.save(
      scoredContributors.map((contributor) => ({
        id: contributor.id,
        globalScore: contributor.globalScore,
        globalRank: contributor.globalRank,
        githubScore: contributor.githubScore,
        githubRank: contributor.githubRank,
        onlydustScore: contributor.onlydustScore,
        onlydustRank: contributor.onlydustRank,
        maxRank: contributor.maxRank,
      })),
    );
  }
}
