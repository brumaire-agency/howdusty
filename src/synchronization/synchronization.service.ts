import { Injectable } from '@nestjs/common';
import { Contributor, ContributorsService } from '@/contributors';
import { ScorerService } from '@/scorer';
import { MetricsService } from '@/metrics';
import { GithubService } from '@/github';

@Injectable()
export class SynchronizationService {
  constructor(
    private contributors: ContributorsService,
    private github: GithubService,
    private metrics: MetricsService,
    private scorer: ScorerService,
  ) {}

  async synchronizeUser(username: string): Promise<Contributor> {
    const usersMetrics = await this.metrics.getMetricsForUsers([username]);
    const userInfo = await this.github.getContributorInfo(username);
    const user = { ...userInfo, ...usersMetrics[username] };
    return await this.contributors.save(user);
  }

  async synchronizeUsers(usernames: string[] = []): Promise<Contributor[]> {
    if (usernames.length === 0) {
      usernames = (await this.contributors.findAll()).map(
        (user) => user.username,
      );
    }
    const usersMetrics = await this.metrics.getMetricsForUsers(usernames);

    return Promise.all(
      Object.keys(usersMetrics).map(async (username) => {
        const userInfo = await this.github.getContributorInfo(username);
        const user = { ...userInfo, ...usersMetrics[username] };
        return await this.contributors.save(user);
      }),
    );
  }

  async scoreUsers(): Promise<void> {
    const contributors = await this.contributors.findAll();
    const scoredContributors = this.scorer.score(contributors);
    await this.contributors.save(
      scoredContributors.map((contributor) => ({
        id: contributor.id,
        rank: contributor.rank,
        score: contributor.score,
      })),
    );
  }
}
