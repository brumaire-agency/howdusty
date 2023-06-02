import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { ContributorsService } from '../contributors/contributors.service';

@Injectable()
export class SynchronizationService {
  constructor(
    private contributors: ContributorsService,
    private github: GithubService,
  ) {}

  async githubUser(username: string) {
    const githubUserInfo = await this.github.getContributorInfo(username);
    if (githubUserInfo) {
      const result = this.contributors.create(githubUserInfo);
      console.log(result);
    }
  }
}
