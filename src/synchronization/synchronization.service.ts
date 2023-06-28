import { Injectable } from '@nestjs/common';
import { GithubService } from '@/github';
import { ContributorsService } from '@/contributors';
import { ScorerService } from '@/scorer';
import { SynchronizedUser } from './types';

@Injectable()
export class SynchronizationService {
  constructor(
    private contributors: ContributorsService,
    private github: GithubService,
    private scorer: ScorerService,
  ) {}

  async synchronizeUser(username: string): Promise<SynchronizedUser> {
    const githubUserInfo = await this.github.getContributorInfo(username);
    if (githubUserInfo) {
      const user = await this.contributors.save(githubUserInfo);
      if (user) {
        return { syncronized: true, username: username };
      } else {
        return { syncronized: false, username: username };
      }
    }
  }

  async synchronizeUsers(usernames?: string[]): Promise<SynchronizedUser[]> {
    const users: SynchronizedUser[] = [];
    if (usernames && usernames.length > 0) {
      for (const username of usernames) {
        const user = await this.synchronizeUser(username);
        users.push(user);
      }
    } else {
      const allUsers = await this.contributors.findAll();
      for (const { username } of allUsers) {
        const user = await this.synchronizeUser(username);
        users.push(user);
      }
    }
    return users;
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
