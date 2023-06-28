import { Injectable } from '@nestjs/common';
import { GithubService, User } from '@/github';
import { ContributorsService } from '@/contributors';
import { ScorerService } from '@/scorer';

@Injectable()
export class SynchronizationService {
  constructor(
    private contributors: ContributorsService,
    private github: GithubService,
    private scorer: ScorerService,
  ) {}

  async synchronizeUser(username: string): Promise<User> {
    return await this.github.getContributorInfo(username);
  }

  async synchronizeUsers(usernames: string[] = []): Promise<User[]> {
    if (usernames.length === 0) {
      usernames = (await this.contributors.findAll()).map(
        (user) => user.username,
      );
    }
    return Promise.all(
      usernames.map((username) => this.synchronizeUser(username)),
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
