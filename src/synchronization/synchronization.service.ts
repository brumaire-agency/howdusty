import { Injectable } from '@nestjs/common';
import { GithubService } from '@/github';
import { Contributor, ContributorsService } from '@/contributors';
import { ScorerService } from '@/scorer';

@Injectable()
export class SynchronizationService {
  constructor(
    private contributors: ContributorsService,
    private github: GithubService,
    private scorer: ScorerService,
  ) {}

  async synchronizeUser(username: string): Promise<Contributor> {
    const githubUserInfo = await this.github.getContributorInfo(username);
    if (githubUserInfo) {
      return await this.contributors.save(githubUserInfo);
    }
  }

  async synchronizeUsers(usernames: string[] = []): Promise<Contributor[]> {
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
