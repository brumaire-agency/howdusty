import { Injectable } from '@nestjs/common';
import { GithubService } from '@/github';
import { Contributor, ContributorsService } from '@/contributors';
import { ScorerService } from '@/scorer';
import { OnlydustService } from '@/onlydust';

@Injectable()
export class SynchronizationService {
  constructor(
    private contributors: ContributorsService,
    private github: GithubService,
    private onlydust: OnlydustService,
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

    const onlydustUsersInfo = await this.onlydust.getContributorsInfo(
      usernames,
    );
    const users = [];
    for (const onlydustUserInfo of onlydustUsersInfo) {
      const githubUserInfo = await this.github.getContributorInfo(
        onlydustUserInfo.username,
      );
      const user = await this.contributors.save({
        id: githubUserInfo.id,
        username: githubUserInfo.username,
        name: githubUserInfo.name,
        avatarUrl: githubUserInfo.avatarUrl,
        totalContributions: githubUserInfo.totalContributions,
        contributedRepositoryCount: githubUserInfo.contributedRepositoryCount,
        maintainedRepositoryCount: githubUserInfo.maintainedRepositoryCount,
        issuePullRequestRatio: githubUserInfo.issuePullRequestRatio,
        activeContributionWeeks: githubUserInfo.activeContributionWeeks,
        collectedGrant: onlydustUserInfo.collectedGrant,
      });
      users.push(user);
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
